import { Body, Controller, Delete, Get, Logger, Param, Post, Res } from '@nestjs/common';
import { LibraryService } from '../services/library/library.service';
import { CreateLibraryRequest } from '../dto/create-library.dto';
import { Response } from 'express';
import { FindMediaService } from '../services/find-media/find-media.service';

@Controller('api/library')
export class LibraryController {
    private readonly logger = new Logger(LibraryController.name);

    constructor(private librarySvc: LibraryService, private findMediaSvc: FindMediaService) { }

    @Post()
    async createLibrary(@Body() req: CreateLibraryRequest) {
        return this.librarySvc.createLibrary(req);
    }

    @Get()
    async getLibraries() {
        return this.librarySvc.getLibraries();
    }

    @Get(':libraryId')
    async getLibrary(@Param('libraryId') libraryId: string) {
        return this.librarySvc.getLibrary(+libraryId);
    }

    @Delete(':libraryId')
    async deleteLibrary(@Param('libraryId') libraryId: string, @Res() response: Response) {
        const lib = await this.librarySvc.getLibrary(+libraryId);
        await this.librarySvc.deleteLibrary(lib);
        response.status(204);
    }

    @Get(':libraryId/media')
    async getMedia(@Param('libraryId') libraryId: string) {
        this.logger.debug(`Loading library contents for ${libraryId}`);
        const library = await this.librarySvc.getLibrary(+libraryId);
        return library;
    }

    @Post(':id/scan')
    scanLibraryFiles(@Param('id') id: string) {
        this.logger.debug(`Scanning library: ${id}`);
        this.findMediaSvc.scanLibraryFiles(+id);
        return {
            started: new Date()
        };
    }
}
