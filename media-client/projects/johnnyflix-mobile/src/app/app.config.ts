import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { JflixServicesModule } from 'jflix-components';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { initializeApp } from './services/init';
import { urlInterceptor } from './interceptors/url.interceptor';
import { JflixBaseUrlService } from 'jflix-components';

export const appConfig: ApplicationConfig = {  
  providers: [
    importProvidersFrom(JflixServicesModule),
    provideHttpClient(withInterceptors([urlInterceptor])),
    provideRouter(routes),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      multi: true,
      deps: [JflixBaseUrlService]
    },
  ]
};
