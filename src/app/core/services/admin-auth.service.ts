import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AdminUser } from '../models/api.models';

@Injectable({
    providedIn: 'root'
})
export class AdminAuthService {
    private readonly baseUrl = `${environment.apiUrl}/admin/auth`;

    // Signals para manejar el estado reactivo sin tocar localStorage
    currentUser = signal<AdminUser | null>(null);
    isLoading = signal<boolean>(true);

    constructor(private http: HttpClient) { }

    // Consulta /me para recuperar la sesión existente por cookie
    checkSession(): Observable<AdminUser | null> {
        this.isLoading.set(true);
        return this.http.get<AdminUser>(`${this.baseUrl}/me`, { withCredentials: true }).pipe(
            tap(user => {
                this.currentUser.set(user);
                this.isLoading.set(false);
            }),
            catchError(() => {
                this.currentUser.set(null);
                this.isLoading.set(false);
                return of(null);
            })
        );
    }

    login(credentials: { username: string; password: string }): Observable<AdminUser> {
        return this.http.post<AdminUser>(`${this.baseUrl}/login`, credentials, { withCredentials: true }).pipe(
            tap(user => this.currentUser.set(user))
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
    }

    isAuthenticated(): boolean {
        return this.currentUser() !== null;
    }
}