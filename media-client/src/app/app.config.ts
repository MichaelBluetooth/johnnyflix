import { APP_INITIALIZER, ApplicationConfig, ErrorHandler, importProvidersFrom } from '@angular/core';
import { provideRouter, withRouterConfig } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { MediaService } from './services/media.service';
import { APP_BASE_HREF } from '@angular/common';
import { urlInterceptor } from './interceptors/url.interceptor';
import { withModule } from '@angular/core/testing';
import { JflixServicesModule } from 'jflix-components';


export function initializeApp(media: MediaService) {
  return (): Promise<void> => new Promise(r => {
    media.loadSupportedVersions()
    r();
  });
}


export const appConfig: ApplicationConfig = {
  
  providers: [
    importProvidersFrom(JflixServicesModule),
    {
      // provide: APP_BASE_HREF, useValue: environment.isProd ? '/client' : '/'
      provide: APP_BASE_HREF, useValue: '/'
    },
    provideRouter(
      routes,
      withRouterConfig({
        onSameUrlNavigation: 'reload'
      })
    ),
    provideHttpClient(withInterceptors([urlInterceptor])),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      multi: true,
      deps: [MediaService],
    },
  ]
};
