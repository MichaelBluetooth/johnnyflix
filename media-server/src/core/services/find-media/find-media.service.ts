import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Job, Queue } from 'bull';
import { LibraryService } from '../library/library.service';
import { JobData, ScanLibraryFilesJobData } from 'src/core/dto/job.dto';

@Injectable()
export class FindMediaService {
    constructor(
        private librarySvc: LibraryService,
        @InjectQueue('find-media') private findMediaQueue: Queue
    ) { }

    async scanLibraryFiles(libraryId: number): Promise<void> {
        const library = await this.librarySvc.getLibrary(libraryId);
        await this.findMediaQueue.add({
            libraryId: library.id,
            libraryName: library.name,
            directories: library.directories.map(d => d.path)
        });
    }

    async cancelJob(id: string){
        const job: Job<any> = await this.findMediaQueue.getJob(id);
        const state = await job?.getState();
        if (state !== 'active' && state !== 'completed') {
            await job?.remove();
        }
    }

    async clearAllJobs() {
        return Promise.all([
            this.findMediaQueue.clean(10, 'active'),
            this.findMediaQueue.clean(10, 'completed'),
            this.findMediaQueue.clean(10, 'delayed'),
            this.findMediaQueue.clean(10, 'failed'),
            this.findMediaQueue.clean(10, 'paused'),
            this.findMediaQueue.clean(10, 'wait'),
        ]);
    }

    async listJobs(): Promise<JobData<ScanLibraryFilesJobData>[]> {
        const jobsDto: JobData<ScanLibraryFilesJobData>[] = [];
        const jobs = await this.findMediaQueue.getJobs(['waiting', 'active', 'completed', 'failed', 'delayed']);
        for (const job of jobs) {
            const state = await job.getState();

            jobsDto.push({
                id: job.id.toString(),
                type: 'scan_library_files',
                status: state,
                completedDate: job.finishedOn ? new Date(job.finishedOn) : null,
                startedDate: job.processedOn ? new Date(job.processedOn) : null,
                failedReason: job.failedReason ? job.failedReason : null,
                data: {
                    libraryId: job.data.libraryId,
                    libraryName: job.data.libraryName
                }
            });
        }
        return jobsDto;
    }
}
