import { Body, Controller, Get, Logger, Param, Post, Put, Res, StreamableFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { MediaService } from '../services/media/media.service';
import { TranscoderService } from '../services/transcoder/transcoder.service';
import { Response } from 'express';
import { UpdateMediaRequest } from '../dto/update-media.dto';
import { createReadStream, existsSync, readFileSync } from 'fs';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { HlsVersion } from '../utils/hls-utils';
import { LibraryService } from '../services/library/library.service';
import { CreateMediaRequest } from '../dto/create-media.dto';
import { ParseCreateMediaBodyPipe } from '../pipes/create-media-body.pipe';
import { ParseUpdateMediaBodyPipe } from '../pipes/update-media-body.pipe';
import { MediaDetails } from '../dto/media-details.dto';
import { join } from 'path';
import { ROOT_DIR } from 'src/app_root';
import { B2 } from '../services/backblaze/backblaze';

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

    
    @Get('B2_TEST')
    async backblazeTest(){
        const file: Buffer = readFileSync("C:/Users/matth/Pictures/Back to the Future Collection.jpeg");

        const b2: B2 = new B2('32893b4e59c0', '005f4d210ec2f1e0589670c8af81a44f8f852ada75');
        await b2.authorize();
        await b2.uploadFile('e332d8f9d35bb44e85e90c10', 'test/posters/b2_test_poster.jpg', file);
        return {ok: true};
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
