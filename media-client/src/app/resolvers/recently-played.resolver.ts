import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Media } from '../models/media.model';
import { PlayHistoryService } from '../services/play-history.service';

export const recentlyPlayedResolver: ResolveFn<Media[]> = (route, state) => {
  const svc = inject(PlayHistoryService);
  return svc.getPlayHistory();
};
