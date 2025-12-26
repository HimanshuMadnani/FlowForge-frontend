import { Injectable, inject } from '@angular/core';
import { CanActivate, CanActivateFn, Router, UrlTree } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private cookieService: CookieService
    ) { }

    canActivate(): boolean | UrlTree {
        const token = this.cookieService.get('authToken');

        if (token && token.length > 0) {
            return true;
        }

        // Redirect to login if not authenticated
        return this.router.createUrlTree(['/login']);
    }
}

// Functional guard for use with newer Angular syntax
export const authGuard: CanActivateFn = () => {
    const router = inject(Router);
    const cookieService = inject(CookieService);

    const token = cookieService.get('authToken');

    if (token && token.length > 0) {
        return true;
    }

    return router.createUrlTree(['/login']);
};
