import { Component } from '@angular/core';
import { ActivatedRoute, Data, RouterModule } from '@angular/router';
import { map } from 'rxjs';
import { toGroupsOfSize } from '../../utils/to-groups-of-size';
import { CommonModule } from '@angular/common';
import { MediaImagePipe } from '../../pipes/media-image.pipe';
import { MediaListComponent } from 'jflix-components';

@Component({
  selector: 'app-recently-played-list',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    MediaImagePipe,
    MediaListComponent
  ],
  templateUrl: './recently-played-list.component.html',
  styleUrl: './recently-played-list.component.scss'
})
export class RecentlyPlayedListComponent {

  media$ = this.route.data
    .pipe(map((d: Data) => {
      // return toGroupsOfSize(d['media'], 4);
      return d['media'];
    }));

  constructor(private route: ActivatedRoute) { }

  ngOnInit() { }
}
