import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpResponse } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, of, switchMap, tap, throwError } from "rxjs";
import { JFlixAuthService } from "../services/auth.service";
import { JFlixPlatformService } from "../services/platform.service";

const ignoredRoutes = new Set<string>(
    [
        'api/auth/ping'
    ]
);

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
    const router = inject(Router);
    const platform = inject(JFlixPlatformService).platform;
    const auth = inject(JFlixAuthService);

    let newReq = req.clone();

    //TODO: how to clean this up?
    //TODO: inject different interceptors depending on platform?
    if(platform === 'web'){
        return next(newReq).pipe(catchError((err: any) => {
            if (!ignoredRoutes.has(req.url) && err.status === 401) {
                auth.clearAccessToken();
                router.navigate(['/login']);
            }
            return throwError(() => err);
        }));
    } else {
        return auth.getAccessToken().pipe(switchMap((accessToken) => {
            let headers = req.headers;
            if (accessToken) {
                headers = headers.set('Authorization', `Bearer ${accessToken}`);
                newReq.clone({
                    headers: headers
                });
            }
    
            return next(newReq).pipe(catchError((err: any) => {
                if (!ignoredRoutes.has(req.url) && err.status === 401) {
                    auth.clearAccessToken();
                    router.navigate(['/login']);
                }
                return throwError(() => err);
            }));
        }));
    }    
};