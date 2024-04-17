import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Media } from '../../../models/media.model';
import { JflixMediaFormService } from '../media-form.service';

export interface MediaData {
  media: any;
  posters?: File[];
  file: File
}

@Component({
  selector: 'jflix-edit-media-modal',
  templateUrl: './edit-media-modal.component.html',
  styleUrl: './edit-media-modal.component.scss'
})
export class EditMediaModalComponent {
  @Input() media: Media;

  @Output() close = new EventEmitter();
  @Output() save = new EventEmitter<MediaData>();

  form: FormGroup;

  isCreate: boolean = false;
  selectedPoster: string = null;
  posterFiles: File[] = [];
  tab: 'details' | 'poster' | 'optimization' = 'details';
  file: File;

  constructor(private mediaFormSvc: JflixMediaFormService) { }

  ngOnInit() {
    this.isCreate = !!this.media;
    if (this.media) {
      this.form = this.mediaFormSvc.initEdit(this.media);
      this.selectedPoster = this.media.posterFileName;
    } else {
      this.form = this.mediaFormSvc.initNew();
    }
  }

  saveChanges() {
    if (this.form.valid) {
      this.save.emit({
        media: {
          name: this.form.value.name,
          description: this.form.value.description,
          releaseYear: this.form.value.releaseYear,
          tags: this.form.value.tags?.split(',').map(tag => tag.trim()),
          duration: (this.form.value.durationHrs * 3.6e+6) + (this.form.value.durationMin * 60000),
          fileName: this.file?.name,
          posterFileName: this.selectedPoster,
          posterFileNames: this.posterFiles.map(poster => poster.name),
          versions: this.form.value.versions
        },
        posters: this.posterFiles,
        file: this.file
      });
    }
  }

  posterUploaded(files: File[]) {
    this.posterFiles = this.posterFiles.concat(files);
  }
}
