import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import videojs from 'video.js';
import { PlayHistoryService } from '../../services/play-history.service';
import { Media } from '../../models/media.model';

@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [],
  templateUrl: './video-player.component.html',
  styleUrl: './video-player.component.scss'
})
export class VideoPlayerComponent implements OnInit {
  @ViewChild('target', { static: true }) target: ElementRef;

  media: Media;
  options = {
    controls: true,
    autoplay: false,
    sources: []
  };
  player: any; //videojs.Player;

  constructor(private route: ActivatedRoute, private playHistorySvc: PlayHistoryService) { }


  ngOnInit(): void {
    const restart = !!this.route.snapshot.queryParams['restart'];
    this.media = this.route.snapshot.data['media'];

    this.options.sources.push({
      src: `${window.location.origin}/api/video/${this.media.id}/manifest.m3u8`,
      type: 'application/x-mpegURL'
    });
    this.player = videojs(this.target.nativeElement, this.options, () => {
      const previousPosition = localStorage.getItem(this.media.id.toString()) || this.media.lastPosition;
      if (previousPosition && !restart) {
        this.player.currentTime(previousPosition);
      }

      this.player.on('ended', () => {
        this.playHistorySvc.clearPlayHistory(this.media.id);
      });

      this.player.on('timeupdate', (evt) => {
        if (this.player.currentTime() === this.player.duration()) {
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
