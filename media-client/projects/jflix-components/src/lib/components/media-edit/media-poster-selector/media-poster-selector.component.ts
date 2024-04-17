import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { toGroupsOfSize } from '../../../utils/to-groups-of-size';
import { Media } from '../../../models/media.model';
import { JflixMediaService } from '../../../services/media.service';

interface MediaPoster {
  name?: string;
  file?: File;
}

@Component({
  selector: 'jflix-media-poster-selector',
  templateUrl: './media-poster-selector.component.html',
  styleUrl: './media-poster-selector.component.scss'
})
export class MediaPosterSelectorComponent {
  @ViewChild('input', { static: true }) input: ElementRef;

  @Input() media: Media;
  @Output() posterSelected = new EventEmitter<string>();

  @Output() fileUploaded = new EventEmitter<File[]>();

  selectedPoster: string;
  groupSize = 4;
  posters: MediaPoster[][] = [];

  constructor(private mediaSvc: JflixMediaService) { }

  ngOnInit() {
    if (this.media && this.media.id) {
      this.selectedPoster = this.media.posterFileName;
      this.mediaSvc.listPosters(this.media.id).subscribe((posters: string[]) => {
        this.posters = toGroupsOfSize(posters.map(p => {return {name: p}}), this.groupSize);
      });
    }
  }

  uploadFile(evt: any): void {
    if (this.media) {
      this.uploadForExistingMedia(evt);
    }else{
      this.uploadForNewMedia(evt);
    }
  }

  selectPoster(name: string) {
    this.selectedPoster = name;
    this.posterSelected.emit(name);
  }

  uploadForExistingMedia(evt) {
    this.mediaSvc.uploadPosters(this.media.id, Array.from(evt.target.files)).subscribe((posters: string[]) => {
      this.selectPoster(evt.target.files[0].name);
      this.posters = toGroupsOfSize(posters.map(p => {return {name: p}}), this.groupSize);
      this.input.nativeElement.value = null;
    });
  }

  uploadForNewMedia(evt: any) {
    const newFiles: File[] = [];
    for (const file of evt.target.files) {
      newFiles.push(file);
    }
    this.fileUploaded.emit(newFiles);

    let fileList: MediaPoster[] = [];
    for (const row of this.posters) {
      fileList = fileList.concat(row);
    }
    fileList = fileList.concat(newFiles.map(file => {return {file}}));
    this.posters = toGroupsOfSize(fileList, this.groupSize);

    this.selectPoster(newFiles[0].name);
  }
}
