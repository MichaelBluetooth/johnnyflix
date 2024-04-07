import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Media } from '../../models/media.model';

@Component({
  selector: 'app-media-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './media-form.component.html',
  styleUrl: './media-form.component.scss'
})
export class MediaFormComponent {
  @Input() form: FormGroup;

  @Output() fileUploaded = new EventEmitter<File>();

  onFileUpload(evt: any){
    this.fileUploaded.emit(evt.target.files[0]);
  }
}
