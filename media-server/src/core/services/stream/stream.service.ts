import { Inject, Injectable, Logger } from '@nestjs/common';
import sanitize from 'sanitize-filename';
import { MediaService } from '../media/media.service';
import { Media } from '../../entities/media.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

export enum StreamResolution {
    small = '320x180',
    medium = '854x480',
    large = '1280x720'
}

interface CachedMedia {
    path: string;
    fileName: string;
}

@Injectable()
export class StreamService {
    private readonly logger = new Logger(StreamService.name);

    constructor(private mediaSvc: MediaService, @Inject(CACHE_MANAGER) private cacheManager: Cache) { }

    async getManifest(mediaId: number, resolution: StreamResolution): Promise<string> {
        this.logger.debug(`Fetching manifest ${resolution} for media: ${mediaId}`);
        const cachedMedia: CachedMedia = await this.getMedia(mediaId);
        return `${cachedMedia.path}/hls/${cachedMedia.fileName}_${resolution}.m3u8`;
    }

    async getSegment(mediaId: number, segment: string) {
        this.logger.debug(`Fetching segment: ${segment} for media: ${mediaId}`);
        const cachedMedia: CachedMedia = await this.getMedia(mediaId);
        return `${cachedMedia.path}/hls/${segment}`;
    }

    async getMedia(mediaId: number): Promise<CachedMedia> {
        const cacheKey = `media_${mediaId}`;
        let cachedMedia: CachedMedia = await this.cacheManager.get<CachedMedia>(cacheKey);
        if (!cachedMedia) {
            this.logger.debug(`Loading media [${mediaId}] from DB`);
            const media: Media = await this.mediaSvc.getMedia(mediaId);
            cachedMedia = { path: media.path, fileName: media.fileName };
            this.cacheManager.set(cacheKey, cachedMedia);
        } else {
            this.logger.debug(`Media [${mediaId}] loaded from cache`);
        }
        return cachedMedia;
    }

    getSafeFolderName(name: string): string {
        return sanitize(name);
    }
}
