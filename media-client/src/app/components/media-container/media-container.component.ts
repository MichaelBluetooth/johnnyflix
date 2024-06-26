import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MediaService } from '../../services/media.service';
import { Media } from '../../models/media.model';
import { MediaViewComponent } from 'jflix-components';

@Component({
  selector: 'app-media-container',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MediaViewComponent
  ],
  templateUrl: './media-container.component.html',
  styleUrl: './media-container.component.scss'
})
export class MediaContainerComponent implements OnInit {
  @ViewChild('container', {read: ViewContainerRef}) container: ViewContainerRef;

  media: Media = null;

  constructor(private route: ActivatedRoute, private mediaSvc: MediaService){}

  ngOnInit(){
    this.media = this.route.snapshot.data['media'];
  }

  edit(){
    this.mediaSvc.editMedia(this.media, this.container).subscribe((media: Media) => {
      this.media = media;
    });
  }
}
