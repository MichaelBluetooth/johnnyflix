import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Media } from '../../models/media.model';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MediaFormComponent } from '../media-form/media-form.component';
import { MediaPosterSelectorComponent } from '../media-poster-selector/media-poster-selector.component';
import { MediaOptimizationComponent } from '../media-optimization/media-optimization.component';
import { MediaFormService } from '../../services/media-form.service';

export interface MediaData {
  media: any;
  posters?: File[];
  file: File
}

@Component({
  selector: 'app-edit-media-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MediaFormComponent,
    MediaPosterSelectorComponent,
    MediaOptimizationComponent
  ],
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

  constructor(private mediaFormSvc: MediaFormService) { }

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
