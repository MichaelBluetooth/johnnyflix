import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'jflix-media-form',
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
