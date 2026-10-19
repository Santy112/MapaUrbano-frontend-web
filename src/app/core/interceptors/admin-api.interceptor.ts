import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AdminAuthService } from '../services/admin-auth.service';

export const adminApiInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AdminAuthService);
    const router = inject(Router);

    // Solo interceptamos llamadas administrativas
    if (!req.url.includes('/api/v1/admin')) {
        return next(req);
    }

    let headers = req.headers;
    const csrfToken = authService.csrfToken();
    const mutableMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];

    if (csrfToken && mutableMethods.includes(req.method)) {
        headers = headers.set('X-CSRF-Token', csrfToken);
    }

    const clonedReq = req.clone({
        withCredentials: true,
        headers
    });

    return next(clonedReq).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
                authService.clearSession();
                router.navigate(['/login']);
            }
            return throwError(() => error);
        })
    );
};