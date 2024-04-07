import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideRouter, withRouterConfig } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { MediaService } from './services/media.service';
import { APP_BASE_HREF } from '@angular/common';
import { environment } from '../environments/environment';


export function initializeApp(media: MediaService) {
  return (): Promise<void> => new Promise(r => {
    media.loadSupportedVersions()
    r();
  });
}


export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: APP_BASE_HREF, useValue: environment.isProd ? '/client' : '/'
    },
    provideRouter(
      routes,
      withRouterConfig({
        onSameUrlNavigation: 'reload'
      })
    ),
    provideHttpClient(),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      multi: true,
      deps: [MediaService],
    },]
};
