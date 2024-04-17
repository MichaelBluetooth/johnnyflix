import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, tap } from 'rxjs';

export const urlInterceptor: HttpInterceptorFn = (req, next) => {
  console.log(`URL: ${req.url}`);
  const newReq = req.clone({ url: environment.baseUrl + req.url });

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
