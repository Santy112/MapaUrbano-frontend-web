import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AdminUser, AdminAuthResponse } from '../models/api.models';

@Injectable({
    providedIn: 'root'
})
export class AdminAuthService {
    private readonly baseUrl = `${environment.apiUrl}/admin/auth`;

    currentUser = signal<AdminUser | null>(null);
    csrfToken = signal<string | null>(null);
    isLoading = signal<boolean>(true);

    constructor(private http: HttpClient) { }

    checkSession(): Observable<AdminUser | null> {
        this.isLoading.set(true);
        return this.http.get<AdminAuthResponse>(`${this.baseUrl}/me`, { withCredentials: true }).pipe(
            tap(res => {
                this.currentUser.set({ adminUserId: res.adminUserId, username: res.username });
                this.csrfToken.set(res.csrfToken);
                this.isLoading.set(false);
            }),
            catchError(() => {
                this.clearSession();
                this.isLoading.set(false);
                return of(null);
            })
        );
    }

    login(credentials: { username: string; password: string }): Observable<AdminAuthResponse> {
        return this.http.post<AdminAuthResponse>(`${this.baseUrl}/login`, credentials, { withCredentials: true }).pipe(
            tap(res => {
                this.currentUser.set({ adminUserId: res.adminUserId, username: res.username });
                this.csrfToken.set(res.csrfToken);
            })
        );
    }

    logout(): Observable<void> {
        return this.http.post<void>(`${this.baseUrl}/logout`, {}, { withCredentials: true }).pipe(
            tap(() => this.clearSession()),
            catchError(() => {
                this.clearSession();
                return of(void 0);
            })
        );
    }

    clearSession(): void {
        this.currentUser.set(null);
        this.csrfToken.set(null);
    }

    isAuthenticated(): boolean {
        return this.currentUser() !== null;
    }
}