import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AdminStatistics } from '../models/api.models';

@Injectable({
    providedIn: 'root'
})
export class AdminStatisticsService {
    private readonly baseUrl = `${environment.apiUrl}/admin/statistics`;

    stats = signal<AdminStatistics | null>(null);
    isLoading = signal<boolean>(false);

    constructor(private http: HttpClient) { }

    getStatistics(): Observable<AdminStatistics> {
        this.isLoading.set(true);
        return this.http.get<AdminStatistics>(this.baseUrl).pipe(
            tap(data => {
                this.stats.set(data);
                this.isLoading.set(false);
            })
        );
    }
}