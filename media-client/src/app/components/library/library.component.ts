import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { Library } from '../../models/library.model';
import { CommonModule } from '@angular/common';
import { LibraryService } from '../../services/library.service';
import { ActivatedRoute, Data, RouterModule } from '@angular/router';
import { MediaImagePipe } from '../../pipes/media-image.pipe';
import { toGroupsOfSize } from '../../utils/to-groups-of-size';
import { MediaService } from '../../services/media.service';
import { Media } from '../../models/media.model';
import { MediaGridComponent } from 'jflix-components';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MediaGridComponent
  ],
  templateUrl: './library.component.html',
  styleUrl: './library.component.scss'
})
export class LibraryComponent {
  @ViewChild('container', { read: ViewContainerRef }) container: ViewContainerRef;

  library: Library = null;

  constructor(private route: ActivatedRoute, private mediaSvc: MediaService, private libSvc: LibraryService) { }

  ngOnInit() {
    this.route.data.subscribe((d: Data) => {
      this.library = d['library'];
    });
  }

  get rows() {
    return toGroupsOfSize(this.library.media, 4);
  }

  addMedia() {
    this.mediaSvc.createMedia(this.library.id, this.container).subscribe((media: Media) => {
      window.location.reload();
    });
  }

  scanLibraryFiles(){
    this.libSvc.scanLibraryFiles(this.library.id);
  }
}
