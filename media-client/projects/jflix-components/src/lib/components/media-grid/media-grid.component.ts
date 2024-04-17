import { Component, Input } from '@angular/core';
import { Media } from '../../models/media.model';
import { CommonModule } from '@angular/common';
import { MediaImagePipe } from '../../pipes/media-image.pipe';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'jflix-media-grid',
  standalone: true,
  imports: [
    CommonModule,
    MediaImagePipe,
    RouterModule
  ],
  templateUrl: './media-grid.component.html',
  styleUrl: './media-grid.component.scss'
})
export class MediaGridComponent {
  @Input() mediaList: Media[] = [];
}
