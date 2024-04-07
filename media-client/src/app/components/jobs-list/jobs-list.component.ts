import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Data, Router, RouterModule } from '@angular/router';
import { Observable, map } from 'rxjs';
import { StatusTagPipe } from '../../pipes/status-tag.pipe';
import { Job, ScanLibraryFilesJobData, TranscodeJobData } from '../../models/job.model';
import { MediaVersionNamePipe } from '../../pipes/media-version-name.pipe';
import { JobService } from '../../services/job.service';

@Component({
  selector: 'app-jobs-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    StatusTagPipe,
    MediaVersionNamePipe
  ],
  templateUrl: './jobs-list.component.html',
  styleUrl: './jobs-list.component.scss'
})
export class JobsListComponent {
  jobs$: Observable<Job<ScanLibraryFilesJobData | TranscodeJobData>[]> = this.route.data.pipe(map((d: Data) => {
    const jobs: Job<ScanLibraryFilesJobData | TranscodeJobData>[] = d['jobs'];
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

  constructor(private route: ActivatedRoute, private jobSvc: JobService, private router: Router) { }

  transcodeData(job: Job<any>): TranscodeJobData {
    return job.type === 'transcode' ? job.data : null
  }

  scanLibraryFilesData(job: Job<any>): ScanLibraryFilesJobData {
    return job.type === 'scan_library_files' ? job.data : null
  }

  cancelJob(id: string){
    this.jobSvc.cancel(id).subscribe(() => {
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate(['/jobs']);
      });
    });
  }
}
