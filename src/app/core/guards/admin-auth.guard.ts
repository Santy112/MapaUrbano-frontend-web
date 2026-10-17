import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AdminAuthService } from '../services/admin-auth.service';
import { map } from 'rxjs';

export const adminAuthGuard: CanActivateFn = () => {
    const authService = inject(AdminAuthService);
    const router = inject(Router);

    if (authService.isAuthenticated()) {
        return true;
    }

    return authService.checkSession().pipe(
        map(user => {
            if (user) {
                return true;
            }
            return router.createUrlTree(['/login']);
        })
    );
};