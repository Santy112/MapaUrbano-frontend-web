import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AdminStatistics {
    totalReports: number;
    byStatus: {
        pending: number;
        inProgress: number;
        resolved: number;
        rejected: number;
    };
    byPriority: {
        low: number;
        medium: number;
        high: number;
        critical: number;
    };
    byCategory: Array<{ slug: string; name: string; count: number; percentage: number }>;
}

@Injectable({
    providedIn: 'root'
})
export class AdminStatisticsService {
    private readonly baseUrl = `${environment.apiUrl}/admin/statistics`;

    stats = signal<AdminStatistics | null>(null);
    isLoading = signal<boolean>(false);

    private fallbackStats: AdminStatistics = {
        totalReports: 5,
        byStatus: {
            pending: 2,
            inProgress: 2,
            resolved: 1,
            rejected: 0
        },
        byPriority: {
            low: 1,
            medium: 2,
            high: 1,
            critical: 1
        },
        byCategory: [
            { slug: 'vialidad', name: 'Vialidad y Asfalto', count: 1, percentage: 20 },
            { slug: 'alumbrado', name: 'Alumbrado Público', count: 1, percentage: 20 },
            { slug: 'arbolado', name: 'Arbolado y Espacios Verdes', count: 1, percentage: 20 },
            { slug: 'higiene', name: 'Higiene Urbana', count: 1, percentage: 20 },
            { slug: 'agua', name: 'Obras Sanitarias y Agua', count: 1, percentage: 20 }
        ]
    };

    constructor(private http: HttpClient) { }

    getStatistics(): Observable<AdminStatistics> {
        this.isLoading.set(true);
        return this.http.get<AdminStatistics>(this.baseUrl, { withCredentials: true }).pipe(
            tap(data => {
                this.stats.set(data);
                this.isLoading.set(false);
            }),
            catchError(() => {
                this.stats.set(this.fallbackStats);
                this.isLoading.set(false);
                return of(this.fallbackStats);
            })
        );
    }
}