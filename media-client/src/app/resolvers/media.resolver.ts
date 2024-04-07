import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { MediaService } from '../services/media.service';
import { Media } from '../models/media.model';

export const mediaResolver: ResolveFn<Media> = (route, state) => {
  const svc = inject(MediaService);
  return svc.getMedia(+route.params['id']);
};
