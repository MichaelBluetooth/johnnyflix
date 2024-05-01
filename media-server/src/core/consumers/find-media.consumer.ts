import { OnQueueCompleted, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { createWriteStream, existsSync, mkdirSync, readdirSync } from 'fs';
import { basename, extname, join } from 'path';
import { Media } from '../entities/media.entity';
import { MediaService } from '../services/media/media.service';
import { TMDBService } from '../services/tmdb/tmdb.service';
import { getVideoDurationInSeconds } from 'get-video-duration';
import { SettingsService } from '../services/settings/settings.service';
import { TranscoderService } from '../services/transcoder/transcoder.service';
import { HlsVersion } from '../utils/hls-utils';
import { TMDBGenre } from '../dto/tmdb-genre.dto';

export interface FindMedataJobData {
    libraryId: number;
    libraryName: string;
    directories: string[];
}

@Processor('find-media')
export class FindMediaConsumer {
    private readonly allowed_file_types: Set<string> = new Set(['.mkv', '.mp4']);
    private readonly logger = new Logger(FindMediaConsumer.name);
    private readonly max_number_images = 10;

    constructor(
        private mediaSvc: MediaService,
        private tmdb: TMDBService,
        private settings: SettingsService,
        private transcodeSvc: TranscoderService
    ) { }

    ThroughDirectory(dir: string, files: { name: string, path: string }[] = []) {
        files = files || [];

        readdirSync(dir, { withFileTypes: true }).forEach(file => {
            if (file.isDirectory()) {
                return this.ThroughDirectory(file.name, files);
            }
            else {
                files.push({
                    name: file.name,
                    path: file.path
                });
            }
        });

        return files;
    }

    findAllFiles(dir: string, files: any[] = []) {
        files = files || [];

        for (const file of readdirSync(dir, { withFileTypes: true })) {
            if (file.isDirectory()) {
                const absolute = join(dir, file.name);
                this.findAllFiles(absolute, files);
            } else if (file.isFile() && this.allowed_file_types.has(extname(file.name))) {
                files.push({
                    name: file.name,
                    path: file.path
                });
            }
        }

        return files;
    }

    @Process()
    async process(job: Job<FindMedataJobData>) {
        this.logger.debug(`Processing library: ${job.data.libraryName}`);

        const genres: Map<number, string> = await this.tmdb.getMovieGenres().then((genresList: { genres: TMDBGenre[] }) => {
            const genresMap = new Map<number, string>();
            genresList.genres.forEach(genre => {
                genresMap.set(genre.id, genre.name);
            });
            return genresMap;
        });

        this.logger.debug(JSON.stringify(job.data.directories));
        for (const dir of job.data.directories) {
            this.logger.debug(`Reading dir: ${dir}`);

            // const files = await readdirSync(dir, { recursive: true, withFileTypes: true });
            const files = this.findAllFiles(dir);
            const movies = files.filter(file => this.allowed_file_types.has(extname(file.name)));
            this.logger.debug(`Found movies: ${JSON.stringify(movies.map(m => m.path))}`);
            for (const movie of movies) {
                this.logger.debug(`Found movie: ${movie.path}\\${movie.name}`);

                const media: Media = await this.mediaSvc.findMediaByFileNameAndPath(movie.name, movie.path)
                if (media) {
                    this.logger.debug(`Movie already found`);
                } else {
                    this.logger.debug(`New movie identified`);

                    const durationMS = Math.floor((await getVideoDurationInSeconds(join(movie.path, movie.name))) * 1000);
                    const tmdbMatch = await this.tmdb.findBestMatch(movie.name);
                    this.logger.debug(`Found ${tmdbMatch.total_results} matches`);

                    let media: Media = null
                    if (tmdbMatch.total_results > 0) {
                        const images = await this.tmdb.getMoviePosters(tmdbMatch.results[0].id);
                        images.posters.sort((a, b) => {
                            if (a.vote_average === b.vote_average) {
                                return a.vote_count > b.vote_count ? -1 : 1;
                            } else {
                                return a.vote_average > b.vote_average ? -1 : 1;
                            }
                        });
                        images.backdrops.sort((a, b) => {
                            if (a.vote_average === b.vote_average) {
                                return a.vote_count > b.vote_count ? -1 : 1;
                            } else {
                                return a.vote_average > b.vote_average ? -1 : 1;
                            }
                        });
                        for (const poster of images.posters.slice(0, this.max_number_images)) {
                            this.savePoster(movie.path, 'posters', poster.file_path);
                        }
                        for (const backdrop of images.backdrops.slice(0, this.max_number_images)) {
                            this.savePoster(movie.path, 'backdrops', backdrop.file_path);
                        }

                        const releaseYear = Number(tmdbMatch.results[0].release_date.split('-')[0]);
                        const posterFileName = basename(images.posters[0].file_path);
                        media = await this.mediaSvc.associateMedia({
                            libraryId: job.data.libraryId,
                            fileName: movie.name,
                            filePath: movie.path,

                            name: tmdbMatch.results[0].title,
                            description: tmdbMatch.results[0].overview,
                            releaseYear: releaseYear > 0 ? releaseYear : null,
                            posterFileName: posterFileName,
                            availablePosters: images.posters.slice(0, this.max_number_images).map(poster => basename(poster.file_path)),
                            duration: durationMS,
                            tags: tmdbMatch.results[0].genre_ids.map(id => genres.has(id) ? genres.get(id) : null).filter(name => !!name)
                        });

                    } else {
                        media = await this.mediaSvc.associateMedia({
                            libraryId: job.data.libraryId,
                            fileName: movie.name,
                            filePath: movie.path,
                            name: movie.name,
                            duration: durationMS
                        });
                    }

                    for (const version of HlsVersion.ALL) {
                        if (this.settings.defaultVersions.has(version.name)) {
                            this.transcodeSvc.queueMediaForTranscode(media.name, media.id, media.fileName, media.path, version);
                        }
                    }
                }
            }
        }
    }

    async savePoster(rootDir: string, folder: string, fileName: string) {
        const dirAbsolute = join(rootDir, folder);
        const fileNameAbsolute = join(rootDir, folder, fileName);
        const blob = await this.tmdb.getPoster(fileName);
        if (!existsSync(dirAbsolute)) {
            mkdirSync(dirAbsolute, { recursive: true });
        }
        const buffer = Buffer.from(await blob.arrayBuffer());
        await createWriteStream(fileNameAbsolute).write(buffer);
    }

    // @OnQueueActive()
    // onActive(job: Job) {
    //     this.logger.debug(
    //         `Starting job ${job.id} of type ${job.name} with data ${job.data.fileName}...`,
    //     );
    // }

    @OnQueueCompleted()
    onCompleted(job: Job<FindMedataJobData>) {
        this.logger.debug(
            `Finished finding media for library: ${job.data.libraryName}`,
        );
    }

    // @OnQueueError()
    // onError(job: Job) {
    //     this.logger.error(
    //         `Job errored!`,
    //     );
    // }    
}