import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { HomeContent, HomeService } from '../services/home.service';

export const homeResolver: ResolveFn<HomeContent> = (route, state) => {
  const svc = inject(HomeService);
  return svc.getHomeContent();
};
