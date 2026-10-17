import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AdminTeamMember {
    id: string;
    fullName: string;
    role: string;
}

export interface AdminTeam {
    id: string;
    name: string;
    specialty: string;
    isActive: boolean;
    membersCount: number;
}

@Injectable({
    providedIn: 'root'
})
export class AdminTeamsService {
    private readonly baseUrl = `${environment.apiUrl}/admin/teams`;

    teams = signal<AdminTeam[]>([]);
    isLoading = signal<boolean>(false);

    private fallbackTeams: AdminTeam[] = [
        { id: 't1', name: 'Cuadrilla Bacheo Norte', specialty: 'Vialidad', isActive: true, membersCount: 4 },
        { id: 't2', name: 'Cuadrilla Alumbrado Centro', specialty: 'Alumbrado', isActive: true, membersCount: 3 },
        { id: 't3', name: 'Poda y Emergencias Verdes', specialty: 'Arbolado', isActive: true, membersCount: 5 },
        { id: 't4', name: 'Saneamiento y Redes', specialty: 'Obras y Agua', isActive: true, membersCount: 4 }
    ];

    constructor(private http: HttpClient) { }

    getTeams(): Observable<AdminTeam[]> {
        this.isLoading.set(true);
        return this.http.get<AdminTeam[]>(this.baseUrl, { withCredentials: true }).pipe(
            tap(data => {
                this.teams.set(data);
                this.isLoading.set(false);
            }),
            catchError(() => {
                this.teams.set(this.fallbackTeams);
                this.isLoading.set(false);
                return of(this.fallbackTeams);
            })
        );
    }

    toggleTeamStatus(id: string, currentState: boolean): Observable<AdminTeam> {
        return this.http.patch<AdminTeam>(`${this.baseUrl}/${id}`, { isActive: !currentState }, { withCredentials: true }).pipe(
            tap(updated => {
                this.teams.update(list => list.map(t => t.id === id ? updated : t));
            }),
            catchError(() => {
                this.teams.update(list => list.map(t => t.id === id ? { ...t, isActive: !currentState } : t));
                const found = this.teams().find(t => t.id === id);
                return of(found!);
            })
        );
    }
}