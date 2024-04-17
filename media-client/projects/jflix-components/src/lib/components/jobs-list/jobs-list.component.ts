import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MediaVersionNamePipe } from '../../pipes/media-version-name.pipe';
import { StatusTagPipe } from '../../pipes/status-tag.pipe';
import { Job, JobData, ScanLibraryFilesJobData, TranscodeJobData } from '../../models/job.model';
import { JflixJobService } from '../../services/job.service';

@Component({
  selector: 'jflix-jobs-list',
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
export class JflixJobsListComponent {
  @Input() jobs: Job<JobData>[] = [];

  constructor(private route: ActivatedRoute, private jobSvc: JflixJobService, private router: Router) { }

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
