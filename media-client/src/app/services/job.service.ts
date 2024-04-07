import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Job, ScanLibraryFilesJobData, TranscodeJobData } from '../models/job.model';

@Injectable({
  providedIn: 'root'
})
export class JobService {

  constructor(private http: HttpClient) { }

  getJobs(): Observable<Job<ScanLibraryFilesJobData | TranscodeJobData>[]> {
    return this.http.get<Job<ScanLibraryFilesJobData | TranscodeJobData>[]>(`api/job`);
  }

  cancel(id: string){
    return this.http.delete('api/job/' + id);
  }
}
