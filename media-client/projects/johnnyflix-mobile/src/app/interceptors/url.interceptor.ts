import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, tap } from 'rxjs';
import { JflixBaseUrlService } from 'jflix-components';

export const urlInterceptor: HttpInterceptorFn = (req, next) => {
  const baseUrlSvc = inject(JflixBaseUrlService);  
  const newReq = req.clone({
    url: baseUrlSvc.baseUrl + req.url,
  });

  return next(newReq)
    .pipe(tap((evt: any) => {
      if (evt instanceof HttpResponse) {
        console.log(evt);
      }
    }))
    .pipe(catchError(err => {
      console.log(err);
      throw err;
    }));
};
