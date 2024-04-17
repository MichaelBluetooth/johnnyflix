import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, from, map } from 'rxjs';
import { Job, JobData } from '../models/job.model';

@Injectable()
export class JflixJobService {

  constructor(private http: HttpClient) { }

  getJobs(): Observable<Job<JobData>[]> {
    return this.http.get<Job<JobData>[]>(`api/job/`)
    .pipe(map((jobs: Job<JobData>[]) => {
      jobs.sort((a, b) => {
        if (a.startedDate === null && b.startedDate !== null) {
          return -1;
        } else if (b.startedDate === null && a.startedDate !== null) {
          return 1;
        } else {
          return a.startedDate > b.startedDate ? -1 : 1
        }
      });
      return jobs;
    }));
  }

  cancel(id: string) {
    return this.http.delete('api/job/' + id);
  }
}
