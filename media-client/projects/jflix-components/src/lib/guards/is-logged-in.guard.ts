import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from "@angular/router";
import { JFlixAuthService } from "../services/auth.service";
import { catchError, map, of } from "rxjs";

export const isLoggedInGuard: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const authService = inject(JFlixAuthService)
    return authService.isLoggedIn()
        .pipe(map(() => {
            return true;
        }))
        .pipe(catchError((err) => {
            return of(false);
        }));
}