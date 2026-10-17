import { Routes } from '@angular/router';
import { adminAuthGuard } from './core/guards/admin-auth.guard';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () => import('./features/login/login').then(m => m.Login)
    },
    {
        path: '',
        canActivate: [adminAuthGuard],
        children: [
            {
                path: '',
                loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard)
            },
            {
                path: 'reports',
                loadComponent: () => import('./features/reports/reports').then(m => m.Reports)
            },
            {
                path: 'categories',
                loadComponent: () => import('./features/categories/categories').then(m => m.Categories)
            },
            {
                path: 'statistics',
                loadComponent: () => import('./features/statistics/statistics').then(m => m.Statistics)
            },
            {
                path: 'audit',
                loadComponent: () => import('./features/audit/audit').then(m => m.Audit)
            }
        ]
    },
    {
        path: '**',
        redirectTo: ''
    }
];