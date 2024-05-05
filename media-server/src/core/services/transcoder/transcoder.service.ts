import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Job, Queue } from 'bull';
import { JobData, TranscodeJobData } from 'src/core/dto/job.dto';
import { HlsVersion } from 'src/core/utils/hls-utils';

@Injectable()
export class TranscoderService {
    constructor(@InjectQueue('transcode') private transcodeQueue: Queue) { }

    async queueMediaForTranscode(mediaName: string, mediaId: number, fileName: string, filePath: string, hlsDetails: HlsVersion[]): Promise<void> {
        await this.transcodeQueue.add({
            mediaName: mediaName,
            mediaId: mediaId,
            fileName: fileName,
            filePath: filePath,
            hlsDetail: hlsDetails
        });
    }

    async clearAllJobs() {
        return Promise.all([
            this.transcodeQueue.clean(10, 'active'),
            this.transcodeQueue.clean(10, 'completed'),
            this.transcodeQueue.clean(10, 'delayed'),
            this.transcodeQueue.clean(10, 'failed'),
            this.transcodeQueue.clean(10, 'paused'),
            this.transcodeQueue.clean(10, 'wait'),            
        ]);
    }

    async cancelJob(id: string) {
        const job: Job<any> = await this.transcodeQueue.getJob(id);
        const state = await job?.getState();
        if (state !== 'active' && state !== 'completed') {
            await job?.remove();
        }
    }

    async listJobs(): Promise<JobData<TranscodeJobData>[]> {
        const jobsDto: JobData<TranscodeJobData>[] = [];
        const jobs = await this.transcodeQueue.getJobs(['waiting', 'active', 'completed', 'failed', 'delayed']);
        for (const job of jobs) {
            const state = await job.getState();

            jobsDto.push({
                id: job.id.toString(),
                type: 'transcode',
                status: state,
                completedDate: job.finishedOn ? new Date(job.finishedOn) : null,
                startedDate: job.processedOn ? new Date(job.processedOn) : null,
                failedReason: job.failedReason ? job.failedReason : null,
                data: {
                    fileName: job.data.fileName,
                    mediaName: job.data.mediaName,
                    mediaId: job.data.mediaId,
                    versions: job.data.hlsDetail.map(d => d.name),
                }
            });
        }
        return jobsDto;
    }
}
