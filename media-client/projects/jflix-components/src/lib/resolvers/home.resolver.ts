import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { HomeContent, JflixHomeService } from '../services/home.service';

export const homeResolver: ResolveFn<HomeContent> = (route, state) => {
  const svc = inject(JflixHomeService);
  return svc.getHomeContent();
};
