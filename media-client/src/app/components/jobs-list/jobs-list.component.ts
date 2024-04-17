import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { StatusTagPipe } from '../../pipes/status-tag.pipe';
import { Job, ScanLibraryFilesJobData, TranscodeJobData } from '../../models/job.model';
import { MediaVersionNamePipe } from '../../pipes/media-version-name.pipe';
import { JobService } from '../../services/job.service';
import { JobData } from '../../../../dist/jflix-components/lib/models/job.model';

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
  @Input() jobs: Job<JobData>[] = [];

  constructor(private route: ActivatedRoute, private jobSvc: JobService, private router: Router) { }

  transcodeData(job: Job<any>): TranscodeJobData {
    return job.type === 'transcode' ? job.data : null
  }

  scanLibraryFilesData(job: Job<any>): ScanLibraryFilesJobData {
    return job.type === 'scan_library_files' ? job.data : null
  }

  cancelJob(id: string){
    this.jobSvc.cancel(id).subscribe(() => {
      const currentUrl = this.router.url;
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
      });
    });
  }
}
