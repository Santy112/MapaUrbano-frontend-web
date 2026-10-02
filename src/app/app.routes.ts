import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/dashboard';
import { Reports } from './features/reports/reports';
import { Categories } from './features/categories/categories';
import { Statistics } from './features/statistics/statistics';
import { Audit } from './features/audit/audit';

export const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: Dashboard },
    { path: 'reports', component: Reports },
    { path: 'categories', component: Categories },
    { path: 'statistics', component: Statistics },
    { path: 'audit', component: Audit },
    { path: '**', redirectTo: 'dashboard' }
];