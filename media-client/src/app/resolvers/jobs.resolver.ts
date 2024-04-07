import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Job, ScanLibraryFilesJobData, TranscodeJobData } from '../models/job.model';
import { JobService } from '../services/job.service';

export const jobsResolver: ResolveFn<Job<ScanLibraryFilesJobData | TranscodeJobData>[]> = (route, state) => {
  const svc = inject(JobService);
  return svc.getJobs()
};
