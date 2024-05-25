import { Controller, Get, Logger, Param, Post, Res, StreamableFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { existsSync, createReadStream } from 'fs';
import { join } from 'path';
import { ROOT_DIR } from 'src/app_root';
import { Response } from 'express';
import { MediaService } from '../services/media/media.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '../guards/auth.guard';

@Controller('api/image')
export class ImageController {
    private readonly logger = new Logger(ImageController.name);

    constructor(private mediaSvc: MediaService) { }

    @Get(':mediaId/poster/:name')
    async getPoster(@Param('mediaId') mediaId: string, @Param('name') name: string, @Res({ passthrough: true }) res: Response) {
        this.logger.debug(`Getting poster ${name} for media ${mediaId}`);
        const posterPath = await this.mediaSvc.getPosterPath(+mediaId, name);
        if (existsSync(posterPath)) {
            const file = createReadStream(posterPath);
            res.set({
                'Content-Type': 'image/png',
                'Content-Disposition': 'inline; filename="poster.png"',
            });
            return new StreamableFile(file);
        } else {
            const defaultPosterPath = join(ROOT_DIR, '../assets/default_poster.png');
            this.logger.debug(`Using default poster: ${defaultPosterPath}`);
            const file = createReadStream(defaultPosterPath);
            res.set({
                'Content-Type': 'image/png',
                'Content-Disposition': 'inline; filename="poster.png"',
            });
            return new StreamableFile(file);
        }
    }

    @Get(':id/poster')
    async getPosters(@Param('id') id: string): Promise<string[]> {
        return this.mediaSvc.getPosters(+id);
    }

    @UseGuards(AuthGuard)
    @Post(':id/poster/upload')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'posters', maxCount: 5 }
    ]))
    async posterFile(@Param('id') id: string, @UploadedFiles() files: { posters: Express.Multer.File[] }): Promise<string[]> {
        for (const poster of files.posters) {
            this.logger.debug(`Saving poster for media [${id}]: ${poster.originalname}`);
            await this.mediaSvc.savePoster(+id, poster, poster.originalname);
        }
        return this.mediaSvc.getPosters(+id);
    }

}
