import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JflixJobsListComponent } from 'jflix-components';
import { map } from 'rxjs';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [
    CommonModule,
    JflixJobsListComponent
  ],
  templateUrl: './jobs.component.html',
  styleUrl: './jobs.component.scss'
})
export class JobsComponent {
  jobs$ = this.route.data.pipe(map(d => d['jobs']));

  constructor(private route: ActivatedRoute) { }
}
