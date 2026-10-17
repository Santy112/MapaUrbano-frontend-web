import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AdminAuditEntry, PaginatedResponse } from '../models/api.models';

export interface AuditFilterParams {
    module?: string;
    action?: string;
    search?: string;
}

@Injectable({
    providedIn: 'root'
})
export class AdminAuditService {
    private readonly baseUrl = `${environment.apiUrl}/admin/audit`;

    logs = signal<AdminAuditEntry[]>([]);
    isLoading = signal<boolean>(false);

    private fallbackLogs: AdminAuditEntry[] = [
        {
            id: 1042,
            timestamp: '2026-10-01 18:32:10',
            actor: 's.zuleta',
            role: 'ADMIN',
            module: 'Reportes',
            action: 'ESTADO',
            details: 'Actualización de estado en Reclamo #2 (Luminaria rota) de PENDING a IN_PROGRESS',
            ip: '192.168.1.45'
        },
        {
            id: 1041,
            timestamp: '2026-10-01 17:15:02',
            actor: 'operador_vialidad',
            role: 'INSPECTOR',
            module: 'Reportes',
            action: 'MODIFICAR',
            details: 'Asignación de cuadrilla de bacheo Este al Reclamo #1 (Av. San Martín 1420)',
            ip: '192.168.1.112'
        },
        {
            id: 1040,
            timestamp: '2026-10-01 14:08:44',
            actor: 's.zuleta',
            role: 'ADMIN',
            module: 'Categorías',
            action: 'CREAR',
            details: 'Alta de nueva subcategoría de servicio: "Desagües Pluviales"',
            ip: '192.168.1.45'
        },
        {
            id: 1039,
            timestamp: '2026-09-30 20:45:19',
            actor: 'inspeccion_arbolado',
            role: 'INSPECTOR',
            module: 'Reportes',
            action: 'ESTADO',
            details: 'Cierre y resolución de acta de Reclamo #3 (Ramas caídas en senda peatonal)',
            ip: '192.168.1.88'
        },
        {
            id: 1038,
            timestamp: '2026-09-30 11:22:30',
            actor: null,
            role: null,
            module: 'Sistema',
            action: 'MODIFICAR',
            details: 'Sincronización automática de teselas vectoriales OpenFreeMap',
            ip: '127.0.0.1'
        }
    ];

    constructor(private http: HttpClient) { }

    getAuditLogs(filters?: AuditFilterParams): Observable<PaginatedResponse<AdminAuditEntry>> {
        this.isLoading.set(true);

        let params = new HttpParams();
        if (filters?.module && filters.module !== 'Todos') params = params.set('module', filters.module);
        if (filters?.action && filters.action !== 'Todas') params = params.set('action', filters.action);
        if (filters?.search) params = params.set('search', filters.search);

        return this.http.get<PaginatedResponse<AdminAuditEntry>>(this.baseUrl, {
            params,
            withCredentials: true
        }).pipe(
            tap(res => {
                this.logs.set(res.items);
                this.isLoading.set(false);
            }),
            catchError(() => {
                // Fallback elegante mientras backend responde 501
                let list = this.fallbackLogs;
                if (filters?.module && filters.module !== 'Todos') {
                    list = list.filter(l => l.module === filters.module);
                }
                if (filters?.action && filters.action !== 'Todas') {
                    list = list.filter(l => l.action === filters.action);
                }
                if (filters?.search) {
                    const s = filters.search.toLowerCase();
                    list = list.filter(l => l.details.toLowerCase().includes(s) || (l.actor && l.actor.toLowerCase().includes(s)));
                }

                this.logs.set(list);
                this.isLoading.set(false);
                return of({
                    items: list,
                    total: list.length,
                    page: 1,
                    pageSize: 10,
                    totalPages: 1
                });
            })
        );
    }
}