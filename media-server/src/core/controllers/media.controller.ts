import { Body, Controller, Get, Logger, Param, Post, Put, Res, StreamableFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { MediaService } from '../services/media/media.service';
import { TranscoderService } from '../services/transcoder/transcoder.service';
import { UpdateMediaRequest } from '../dto/update-media.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { HlsVersion } from '../utils/hls-utils';
import { LibraryService } from '../services/library/library.service';
import { CreateMediaRequest } from '../dto/create-media.dto';
import { ParseCreateMediaBodyPipe } from '../pipes/create-media-body.pipe';
import { ParseUpdateMediaBodyPipe } from '../pipes/update-media-body.pipe';
import { MediaDetails } from '../dto/media-details.dto';
import { AuthGuard } from '../guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('api/media')
export class MediaController {
    private readonly logger = new Logger(MediaController.name);

    constructor(
        private mediaSvc: MediaService,
        private transcodeSvc: TranscoderService,
        private librarySvc: LibraryService) { }

    @Get('supportedversions')
    async listSupportedVersions() {
        return HlsVersion.ALL;
    }

    @Get(':id')
    async getById(@Param('id') id: string) {
        return this.mediaSvc.getMediaDetails(+id);
    }

    @Put(':id')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'posters', maxCount: 5 }
    ]))
    async update(
        @Param('id') id: string,
        @Body(ParseUpdateMediaBodyPipe) data: UpdateMediaRequest,
        @UploadedFiles() files: { posters: Express.Multer.File[] }): Promise<MediaDetails> {
        await this.mediaSvc.updateMedia(+id, data, files.posters);
        return this.mediaSvc.getMediaDetails(+id);
    }

    @Post()
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'posters', maxCount: 5 },
        { name: 'file', maxCount: 1 },
    ]))
    async create(
        @Body(ParseCreateMediaBodyPipe) data: CreateMediaRequest,
        @UploadedFiles() files: { posters: Express.Multer.File[], file: Express.Multer.File[] }
    ): Promise<MediaDetails> {
        this.logger.debug(`Creating media with ${files.posters.length} posters`);
        this.logger.debug(`Creating media with ${files.file[0].size} file size`);
        this.logger.debug(`Creating media with data${JSON.stringify(data)}`);

        const media = await this.mediaSvc.createMedia(data, files.file[0], files.posters);
        return this.mediaSvc.getMediaDetails(media.id);
    }

    // @Post(':id/transcode')
    // async startTranscode(@Param('id') id: string, @Body() body: StartTranscode) {
    //     this.logger.debug(`Starting transcode for ${id}: ${JSON.stringify(body)}`);
    //     const media = await this.mediaSvc.getMedia(+id);
    //     // this.transcodeSvc.queueMediaForTranscode(media.name, media.id, media.fileName, media.path);
    // }

    // @Delete(':id/transcode')
    // async deleteOptimizedContent(@Param('id') id: string) {
    //     this.logger.debug(`Deleting optimized content for ${id}`);
    //     await this.mediaSvc.deleteOptimizedContent(+id);
    //     return {};
    // }
}
