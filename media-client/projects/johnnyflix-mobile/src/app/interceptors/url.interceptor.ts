import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, tap } from 'rxjs';
import { JflixBaseUrlService } from 'jflix-components';

export const urlInterceptor: HttpInterceptorFn = (req, next) => {
  const baseUrlSvc = inject(JflixBaseUrlService)
  console.log(`URL: ${req.url}`);  
  const newReq = req.clone({ url: baseUrlSvc.baseUrl + req.url });

  next(newReq)

  return next(newReq)
  .pipe(tap((evt: any) => {
    if (evt instanceof HttpResponse){
      console.log(evt);
    }
  }))
  .pipe(catchError(err => {
    console.log(err);    
    throw err;
  }));
};
