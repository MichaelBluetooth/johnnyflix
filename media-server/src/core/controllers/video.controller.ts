import { Controller, Get, Header, HttpStatus, Logger, Param, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { createReadStream, statSync, readFile } from 'fs';
import { StreamResolution, StreamService } from '../services/stream/stream.service';

@Controller('api/video')
export class VideoController {
    private readonly logger = new Logger(VideoController.name);

    constructor(private streamSvc: StreamService) { }

    @Get(':mediaId/manifest.m3u8')
    async getManifest(@Param('mediaId') mediaId: string, @Param('locator') locator: string, @Res() res: Response) {
        const videoPath: string = await this.streamSvc.getMasterManifest(+mediaId);
        this.logger.debug('Path ' + videoPath);
        this.logger.debug('Locator: ' + locator);
        res.writeHead(200, { 'Access-Control-Allow-Origin': '*' });
        readFile(videoPath, (error, data) => {
            if(error){
                this.logger.error(error);
            }
            res.end(data, 'utf-8');            
        });
    }

    @Get(':mediaId/:version')
    async getManifestVersion(@Param('mediaId') mediaId: string, @Param('version') version: string, @Res() res: Response) {
        const videoPath: string = await this.streamSvc.getManifest(+mediaId, version as any);
        this.logger.debug('Path ' + videoPath);
        this.logger.debug('Version: ' + version);
        res.writeHead(200, { 'Access-Control-Allow-Origin': '*' });
        readFile(videoPath, (error, data) => {
            if(error){
                this.logger.error(error);
            }            
            res.end(data, 'utf-8');            
        });
    }

    @Get(':mediaId/:segment(*\.ts)')
    async getSegment(@Param('mediaId') mediaId: string, @Param('segment') segment: string, @Res() res: Response) {
        this.logger.debug(`MediaId: ${mediaId}, Segment: ${segment}`);
        const segmentPath: string = await this.streamSvc.getSegment(+mediaId, segment);
        res.writeHead(200, { 'Access-Control-Allow-Origin': '*' });
        readFile(segmentPath, (error, data) => {
            if(error){
                this.logger.error(error);
            }
            res.end(data, 'utf-8');
        });
    }

    // @Get('hls')
    // async getHls(@Param('id') id: string, @Req() req, @Res() res: Response) {
    //     this.logger.debug('HLS STEAM GO');
    //     const videoPath = `C:/Users/matth/Videos/hls_test/hls/Judge_Dredd.1995.mkv_320x180.m3u8`;
    //     res.writeHead(200, { 'Access-Control-Allow-Origin': '*' });
    //     readFile(videoPath, (error, data) => {
    //         res.end(data, 'utf-8');
    //     });
    // }

    // @Get(':segment')
    // async getSegment(@Param('segment') segment: string, @Res() res: Response) {
    //     this.logger.debug(segment);
    //     const videoPath = `C:/Users/matth/Videos/hls_test/hls/${segment}`;
    //     res.writeHead(200, { 'Access-Control-Allow-Origin': '*' });
    //     readFile(videoPath, (error, data) => {
    //         res.end(data);
    //     });
    // }

    @Get('stream/:id')
    @Header('Accept-Ranges', 'bytes')
    @Header('Content-Type', 'video/mp4')
    async getStreamVideo(@Param('id') id: string, @Req() req, @Res() res: Response) {
        const videoPath = `C:/Users/matth/Videos/hls_test/hls/Judge_Dredd.1995.mkv_320x180.m3u8`;
        const { size } = statSync(videoPath);
        const videoRange = req.headers.range;
        if (videoRange) {
            this.logger.debug(videoRange);
            const parts = videoRange.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : size - 1;
            const chunksize = (end - start) + 1;
            const readStreamfile = createReadStream(videoPath, { start, end, highWaterMark: 60 });
            const head = {
                'Content-Range': `bytes ${start}-${end}/${size}`,
                'Content-Length': chunksize,
            };
            res.writeHead(HttpStatus.PARTIAL_CONTENT, head); //206
            readStreamfile.pipe(res);
        } else {
            const head = {
                'Content-Length': size,
            };
            res.writeHead(HttpStatus.OK, head);//200
            createReadStream(videoPath).pipe(res);
        }
    }
}
