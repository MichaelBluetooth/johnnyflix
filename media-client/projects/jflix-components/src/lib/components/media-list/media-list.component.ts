import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Media } from '../../models/media.model';
import { CommonModule } from '@angular/common';
import { MediaImagePipe } from '../../pipes/media-image.pipe';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'jflix-media-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MediaImagePipe
  ],
  templateUrl: './media-list.component.html',
  styleUrl: './media-list.component.scss'
})
export class MediaListComponent {
  @Input() title: string = null;
  @Input() mediaList: Media[] = [];

  @ViewChild('scrollable') scrollableEl: ElementRef;

  scrollDistance = 500;

  scrollRight() {
    const el: HTMLElement = this.scrollableEl.nativeElement as HTMLElement;
    el.scrollTo({
      left: el.scrollLeft + this.scrollDistance,
      behavior: 'smooth'
    });
  }

  scrollLeft() {
    const el: HTMLElement = this.scrollableEl.nativeElement as HTMLElement;
    el.scrollTo({
      left: el.scrollLeft - this.scrollDistance,
      behavior: 'smooth'
    });
  }
}
