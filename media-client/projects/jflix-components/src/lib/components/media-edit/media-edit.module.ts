import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaFormComponent } from './media-form/media-form.component';
import { MediaPosterSelectorComponent } from './media-poster-selector/media-poster-selector.component';
import { MediaOptimizationComponent } from './media-optimization/media-optimization.component';
import { EditMediaModalComponent } from './edit-media-modal/edit-media-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MediaVersionNamePipe } from '../../pipes/media-version-name.pipe';
import { FileImagePipe } from '../../pipes/file-image.pipe';
import { MediaImagePipe } from '../../pipes/media-image.pipe';
import { JflixMediaFormService } from './media-form.service';

@NgModule({
  declarations: [
    EditMediaModalComponent,
    MediaFormComponent,
    MediaPosterSelectorComponent,
    MediaOptimizationComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MediaVersionNamePipe,
    FileImagePipe,
    MediaImagePipe,
  ],
  providers: [
    JflixMediaFormService
  ]
})
export class MediaEditModule { }
