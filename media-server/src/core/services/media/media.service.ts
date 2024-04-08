import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { existsSync, rmdirSync, readdirSync, writeFileSync, mkdirSync } from 'fs';
import { AssociateMediaRequest } from 'src/core/dto/associate-media.dto';
import { CreateMediaRequest, CreateMediaVersion } from 'src/core/dto/create-media.dto';
import { UpdateMediaRequest, UpdateMediaVersion } from 'src/core/dto/update-media.dto';
import { LibraryDirectory } from 'src/core/entities/library-directory.entity';
import { Media } from 'src/core/entities/media.entity';
import { HlsUtils, HlsVersion } from 'src/core/utils/hls-utils';
import { Repository } from 'typeorm';
import { TranscoderService } from '../transcoder/transcoder.service';
import { MediaDetails } from 'src/core/dto/media-details.dto';

@Injectable()
export class MediaService {
    private readonly logger = new Logger(MediaService.name);

    constructor(
        @InjectRepository(Media) private mediaRepo: Repository<Media>,
        @InjectRepository(LibraryDirectory) private directoryRep: Repository<LibraryDirectory>,
        private transcoderSvc: TranscoderService
    ) { }

    associateMedia(data: AssociateMediaRequest): Promise<Media> {
        const media = new Media();
        media.name = data.name;
        media.libraryId = data.libraryId;
        media.fileName = data.fileName;
        media.path = data.filePath.replace(/\/$/, "");
        media.tags = data.tags ? data.tags : [];
        media.description = data.description;
        media.releaseYear = data.releaseYear;
        media.duration = data.duration;
        media.posterFileName = data.posterFileName;
        media.availablePosters = data.availablePosters;
        return this.mediaRepo.save(media);
    }


    async createMedia(data: CreateMediaRequest, file: Express.Multer.File, posters: Express.Multer.File[]): Promise<Media> {
        const directory = await this.directoryRep.findOneBy({ libraryId: data.libraryId });

        this.logger.debug(`${JSON.stringify(data)}`);
        this.logger.debug(`Saving file to ${directory.path}`);
        this.logger.debug(`File name ${data.libraryId}`);

        let media = new Media();
        media.name = data.name;
        media.libraryId = data.libraryId;
        media.tags = data.tags ? data.tags : [];
        media.description = data.description;
        media.releaseYear = data.releaseYear;
        media.duration = data.duration;
        media.posterFileName = data.posterFileName;
        media.availablePosters = data.posterFileNames;
        media.fileName = data.fileName;
        media.path = `${directory.path}/${HlsUtils.getSafeFolderName(data.fileName)}`;

        media = await this.mediaRepo.save(media);

        if (!existsSync(media.path)) {
            mkdirSync(media.path, { recursive: true });
        }
        for (let i = 0; i < data.posterFileNames.length; i++) {
            this.savePoster(media.id, posters[i], data.posterFileNames[i]);
        }
        writeFileSync(`${media.path}/${media.fileName}`, file.buffer);


        data.versions?.filter((version: CreateMediaVersion) => version.optimize)?.forEach((version: CreateMediaVersion) => {
            const hlsVersion = HlsVersion.ALL.find(v => v.name === version.name);
            if (hlsVersion) {
                this.transcoderSvc.queueMediaForTranscode(media.name, media.id, media.fileName, media.path, hlsVersion);
            } else {
                this.logger.debug(`Could not find HLS version with name ${version.name}`)
            }
        });

        return media;
    }

    async updateMedia(id: number, data: UpdateMediaRequest, posters?: Express.Multer.File[]): Promise<Media> {
        const media = await this.mediaRepo.findOneBy({ id })
        media.name = data.name;
        media.tags = data.tags ? data.tags : [];
        media.description = data.description;
        media.releaseYear = data.releaseYear;
        media.duration = data.duration;
        media.posterFileName = data.posterFileName;

        for (let i = 0; i < data.posterFileNames.length; i++) {
            this.savePoster(media.id, posters[i], data.posterFileNames[i]);
        }

        data.versions?.forEach((version: UpdateMediaVersion) => {
            if (version.optimize) {
                const hlsVersion = HlsVersion.ALL.find(v => v.name === version.name);
                if (hlsVersion) {
                    this.transcoderSvc.queueMediaForTranscode(media.name, media.id, media.fileName, media.path, hlsVersion);
                } else {
                    this.logger.debug(`Could not find HLS version with name ${version.name}`)
                }
            } else {
                //TODO: clear the optimized version by deleting the HLS content associated with it
            }
        });

        return this.mediaRepo.save(media);
    }

    getMedia(id: number): Promise<Media> {
        return this.mediaRepo.findOneBy({ id });
    }

    async getMediaDetails(id: number): Promise<MediaDetails> {
        const media = await this.mediaRepo.createQueryBuilder('m')
            .leftJoinAndSelect('m.playHistory', 'ph')
            .where('m.id = :id', { id })
            .getOne();

        return this.mediaToDto(media);
    }

    mediaToDto(media: Media): MediaDetails {
        const versions = [];
        const hlsPath = media.path + '/hls';
        HlsVersion.ALL.forEach((version: HlsVersion) => {
            const manifestFileName = HlsUtils.getHlsManifestFileName(media.fileName, version.resolution);
            versions.push({
                name: version.name,
                optimize: existsSync(`${hlsPath}/${manifestFileName}`)
            });
        });

        const posters = [];
        const posterPath = media.path + '/posters';
        const posterPathExists = existsSync(posterPath);
        if (posterPathExists) {
            readdirSync(posterPath, { withFileTypes: true })
                .filter(item => !item.isDirectory())
                .filter(item => item.name.endsWith('.png') || item.name.endsWith('.jpg') || item.name.endsWith('.jpeg'))
                .forEach((file) => {
                    posters.push(file.name);
                });
        }

        const dto: MediaDetails = {
            id: media.id,
            name: media.name,
            tags: media.tags,
            description: media.description,
            duration: media.duration,
            releaseYear: media.releaseYear,
            posterFileName: media.posterFileName,
            lastPlayed: media.playHistory?.length ? media.playHistory[0].lastPlayed : null,
            lastPosition: media.playHistory?.length ? media.playHistory[0].position : 0,
            versions: versions,
            posters: posters
        }
        return dto;
    }

    getMediaByLibraryId(libraryId: number): Promise<Media[]> {
        return this.mediaRepo.findBy({ libraryId });
    }

    deleteMedia(media: Media) {
        return this.mediaRepo.remove(media);
    }

    async deleteOptimizedContent(id: number) {
        const media: Media = await this.getMedia(id);
        const hlsPath = media.path + '/hls';
        if (existsSync(hlsPath)) {
            this.logger.debug('HLS path exists, deleting...');
            rmdirSync(hlsPath, { recursive: true });
            this.logger.debug('Deleting complete');
        }
    }

    async getPosterPath(id: number, posterFileName: string) {
        const media = await this.mediaRepo.createQueryBuilder('m')
            .innerJoinAndSelect('m.library', 'lib')
            .where('m.id = :id', { id })
            .getOne();
        return `${media.path}/posters/${posterFileName}`;
    }

    async getPosters(id: number) {
        const media = await this.mediaRepo.findOneBy({ id });
        // const postersPath = media.path + '/posters';
        // const files = readdirSync(postersPath);
        return media.availablePosters;
    }

    async savePoster(id: number, file: Express.Multer.File, fileName: string) {
        const media = await this.mediaRepo.findOneBy({ id });
        const posterPath = `${media.path}/posters/`;
        if (!existsSync(posterPath)) {
            mkdirSync(posterPath);
        }
        const fullPosterPath = `${posterPath}/${fileName}`;
        this.logger.debug(`Saving poster: ${fileName} to path ${fullPosterPath}`);
        writeFileSync(fullPosterPath, file.buffer);

        media.availablePosters = [...new Set(media.availablePosters.concat([fileName]))];
        this.mediaRepo.save(media);
    }

    findMediaByFileNameAndPath(name: string, path: string) {
        return this.mediaRepo.findOneBy({ fileName: name, path: path });
    }
}
