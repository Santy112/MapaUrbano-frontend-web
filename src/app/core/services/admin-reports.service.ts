import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AdminReport, CursorPaginatedResponse, ReportStatus, ReportPriority } from '../models/api.models';

export interface ReportFilterParams {
    cursor?: string;
    limit?: number;
    status?: string;
    categorySlug?: string;
    priority?: string;
    teamId?: string;
    responsibleAdminUserId?: string;
    search?: string;
}

@Injectable({
    providedIn: 'root'
})
export class AdminReportsService {
    private readonly baseUrl = `${environment.apiUrl}/admin/reports`;

    reports = signal<AdminReport[]>([]);
    totalCount = signal<number>(0);
    nextCursor = signal<string | null>(null);
    isLoading = signal<boolean>(false);
    errorMessage = signal<string | null>(null);

    constructor(private http: HttpClient) { }

    getReports(filters?: ReportFilterParams): Observable<CursorPaginatedResponse<AdminReport>> {
        this.isLoading.set(true);
        this.errorMessage.set(null);

        let params = new HttpParams();
        if (filters?.cursor) params = params.set('cursor', filters.cursor);
        if (filters?.limit) params = params.set('limit', filters.limit.toString());
        if (filters?.status && filters.status !== 'Todos') params = params.set('status', filters.status);
        if (filters?.categorySlug && filters.categorySlug !== 'Todos') params = params.set('categorySlug', filters.categorySlug);
        if (filters?.priority && filters.priority !== 'Todas') params = params.set('priority', filters.priority);
        if (filters?.teamId) params = params.set('teamId', filters.teamId);
        if (filters?.responsibleAdminUserId) params = params.set('responsibleAdminUserId', filters.responsibleAdminUserId);
        if (filters?.search) params = params.set('search', filters.search);

        return this.http.get<CursorPaginatedResponse<AdminReport>>(this.baseUrl, { params }).pipe(
            tap(res => {
                this.reports.set(res.items);
                this.nextCursor.set(res.nextCursor);
                this.totalCount.set(res.totalCount);
                this.isLoading.set(false);
            }),
            catchError((err: HttpErrorResponse) => {
                this.isLoading.set(false);
                this.errorMessage.set(err.error?.message || 'Error al obtener reportes del servidor.');
                return throwError(() => err);
            })
        );
    }

    getReportDetail(id: string): Observable<AdminReport> {
        return this.http.get<AdminReport>(`${this.baseUrl}/${id}`);
    }

    getReportImageBlob(id: string): Observable<Blob> {
        return this.http.get(`${this.baseUrl}/${id}/image`, { responseType: 'blob' });
    }

    updateStatus(id: string, status: ReportStatus, currentVersion: number, note?: string): Observable<AdminReport> {
        return this.http.patch<AdminReport>(`${this.baseUrl}/${id}/status`, { status, version: currentVersion, note }).pipe(
            tap(updated => {
                this.reports.update(list => list.map(r => r.id === id ? updated : r));
            })
        );
    }

    updatePriority(id: string, priority: ReportPriority, currentVersion: number, dueAt?: string): Observable<AdminReport> {
        return this.http.patch<AdminReport>(`${this.baseUrl}/${id}/priority`, { priority, version: currentVersion, dueAt }).pipe(
            tap(updated => {
                this.reports.update(list => list.map(r => r.id === id ? updated : r));
            })
        );
    }

    assignTeamAndUser(id: string, payload: { teamId: string; responsibleAdminUserId: string; version: number }): Observable<AdminReport> {
        return this.http.put<AdminReport>(`${this.baseUrl}/${id}/assignment`, payload).pipe(
            tap(updated => {
                this.reports.update(list => list.map(r => r.id === id ? updated : r));
            })
        );
    }

    unassign(id: string, version: number): Observable<AdminReport> {
        const params = new HttpParams().set('version', version.toString());
        return this.http.delete<AdminReport>(`${this.baseUrl}/${id}/assignment`, { params }).pipe(
            tap(updated => {
                this.reports.update(list => list.map(r => r.id === id ? updated : r));
            })
        );
    }

    deleteReport(id: string): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
            tap(() => {
                this.reports.update(list => list.filter(r => r.id !== id));
            })
        );
    }
}