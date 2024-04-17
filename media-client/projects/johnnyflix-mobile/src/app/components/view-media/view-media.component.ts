import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { MediaViewComponent } from 'jflix-components';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-media',
  standalone: true,
  imports: [
    CommonModule,
    MediaViewComponent
  ],
  templateUrl: './view-media.component.html',
  styleUrl: './view-media.component.scss'
})
export class ViewMediaComponent {
  media$ = this.route.data.pipe(map(d => d['media']));

  constructor(private route: ActivatedRoute){}
} 
