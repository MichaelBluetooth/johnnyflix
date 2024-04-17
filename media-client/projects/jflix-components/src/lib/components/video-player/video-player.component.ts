import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import videojs from 'video.js';

import { Media } from '../../models/media.model';
import { JflixBaseUrlService } from '../../services/base-url.service';
import { JflixPlayHistoryService } from '../../services/play-history.service';

@Component({
  selector: 'jflix-video-player',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './video-player.component.html',
  styleUrl: './video-player.component.scss'
})
export class VideoPlayerComponent {
  @Input() media: Media;
  @Input() restart: boolean = false;

  @ViewChild('target', { static: true }) target: ElementRef;

  options = {
    controls: true,
    autoplay: false,
    sources: []
  };
  player: any; //videojs.Player;

  constructor(private baseUrlSvc: JflixBaseUrlService, private playHistorySvc: JflixPlayHistoryService) { }

  ngOnInit(): void {
    this.options.sources.push({
      src: `${this.baseUrlSvc.baseUrl}api/video/${this.media.id}/manifest.m3u8`,
      type: 'application/x-mpegURL'
    });
    this.player = videojs(this.target.nativeElement, this.options, () => {
      const previousPosition = localStorage.getItem(this.media.id.toString()) || this.media.lastPosition;
      if (previousPosition && this.restart) {
        this.player.currentTime(previousPosition);
      }

      this.player.on('ended', () => {
        this.playHistorySvc.clearPlayHistory(this.media.id);
      });

      this.player.on('timeupdate', (evt) => {
        if (this.player.currentTime() >= this.player.duration()) {
          this.playHistorySvc.clearPlayHistory(this.media.id);
          localStorage.setItem(this.media.id.toString(), '0');
        } else {
          this.playHistorySvc.updatePlayHistory(this.media.id, +this.player.currentTime());
        }
      });
    });    
  }

  ngOnDestroy() {
    if (this.player) {
      const currentTime = this.player.currentTime();
      localStorage.setItem(this.media.id.toString(), currentTime);
      this.player.dispose();
    }
  }
}
