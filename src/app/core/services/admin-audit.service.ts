import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AdminAuditEntry, CursorPaginatedResponse } from '../models/api.models';

@Injectable({
    providedIn: 'root'
})
export class AdminAuditService {
    private readonly baseUrl = `${environment.apiUrl}/admin/audit`;

    logs = signal<AdminAuditEntry[]>([]);
    nextCursor = signal<string | null>(null);
    totalCount = signal<number>(0);
    isLoading = signal<boolean>(false);

    constructor(private http: HttpClient) { }

    getAuditLogs(cursor?: string, limit: number = 20): Observable<CursorPaginatedResponse<AdminAuditEntry>> {
        this.isLoading.set(true);
        let params = new HttpParams().set('limit', limit.toString());
        if (cursor) params = params.set('cursor', cursor);

        return this.http.get<CursorPaginatedResponse<AdminAuditEntry>>(this.baseUrl, { params }).pipe(
            tap(res => {
                this.logs.set(res.items);
                this.nextCursor.set(res.nextCursor);
                this.totalCount.set(res.totalCount);
                this.isLoading.set(false);
            })
        );
    }
}