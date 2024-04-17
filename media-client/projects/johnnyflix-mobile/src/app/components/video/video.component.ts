import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Media } from 'jflix-components';
import { Observable, map } from 'rxjs';
import { VideoPlayerComponent } from 'jflix-components';

@Component({
  selector: 'app-video',
  standalone: true,
  imports: [
    CommonModule,
    VideoPlayerComponent
  ],
  templateUrl: './video.component.html',
  styleUrl: './video.component.scss'
})
export class VideoComponent {
  media$: Observable<Media> = this.route.data.pipe(map(d => d['media']));
  restart$: Observable<boolean> = this.route.queryParams.pipe(map(p => !!p['restart']));

  constructor(private route: ActivatedRoute) { }
}
