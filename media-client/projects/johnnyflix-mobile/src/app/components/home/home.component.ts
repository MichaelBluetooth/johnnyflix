import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { MediaListComponent } from 'jflix-components';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MediaListComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  recentlyAdded$ = this.route.data.pipe(map(d => d['media'].recentlyAdded));
  continueWatching$ = this.route.data.pipe(map(d => d['media'].continueWatching));
  recentlyReleased$ = this.route.data.pipe(map(d => d['media'].recentlyReleased));

  constructor(private route: ActivatedRoute) { }
}
