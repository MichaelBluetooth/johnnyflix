import { Component, EventEmitter, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { Media } from '../../models/media.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DurationToStringPipe } from '../../pipes/duration-to-string.pipe';
import { MediaImagePipe } from '../../pipes/media-image.pipe';
import { MediaEditModule } from '../media-edit/media-edit.module';
import { JflixServicesModule } from '../../services/jflix-services.module';
import { JflixMediaFormService } from '../media-edit/media-form.service';

@Component({
  selector: 'jflix-media-view',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DurationToStringPipe,
    MediaImagePipe,
    MediaEditModule,
  ],
  templateUrl: './media-view.component.html',
  styleUrl: './media-view.component.scss'
})
export class MediaViewComponent {
  @Input() media: Media;
  @Input() mediaChange = new EventEmitter<Media>();

  @ViewChild('container', { read: ViewContainerRef }) container: ViewContainerRef;

  constructor(private mediaSvc: JflixMediaFormService) { }

  edit() {
    this.mediaSvc.editMedia(this.media, this.container).subscribe((updated) => {
      this.media = updated;
      this.mediaChange.emit(this.media);
    });
  }
}
