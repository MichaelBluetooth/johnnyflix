import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Job, JobData } from '../models/job.model';
import { JflixJobService } from '../services/job.service';

export const jobsResolver: ResolveFn<Job<JobData>[]> = (route, state) => {
  const svc = inject(JflixJobService);
  return svc.getJobs()
};
