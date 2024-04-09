import { Controller, Delete, Get, HttpCode, HttpStatus, Logger, Param, Res } from '@nestjs/common';
import { TranscoderService } from '../services/transcoder/transcoder.service';
import { JobData, ScanLibraryFilesJobData, TranscodeJobData } from '../dto/job.dto';
import { FindMediaService } from '../services/find-media/find-media.service';

@Controller('api/job')
export class JobController {
    private readonly logger = new Logger(JobController.name);

    constructor(private transcodeSvc: TranscoderService, private findMediaSvc: FindMediaService) { }

    @Get()
    async listJobs(): Promise<JobData<TranscodeJobData | ScanLibraryFilesJobData>[]> {
        this.logger.debug('Listing jobs');
        const transcodeJobs = await this.transcodeSvc.listJobs();
        const scanLibraryFilesJobs = await this.findMediaSvc.listJobs();
        const ret: JobData<TranscodeJobData | ScanLibraryFilesJobData>[] = [];
        return ret.concat(transcodeJobs).concat(scanLibraryFilesJobs);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteJob(@Param('id') id: string) {
        this.transcodeSvc.cancelJob(id);
        this.findMediaSvc.cancelJob(id);
    }
}
