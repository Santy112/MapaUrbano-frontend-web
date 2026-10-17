import { Injectable, signal, OnDestroy } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AdminReportsService } from './admin-reports.service';

export interface WebSocketEvent {
    type: string;
    occurredAt: string;
    payload: any;
}

@Injectable({
    providedIn: 'root'
})
export class AdminRealtimeService implements OnDestroy {
    private socket: WebSocket | null = null;
    private reconnectInterval = 3000;
    private shouldReconnect = true;

    isConnected = signal<boolean>(false);

    constructor(private reportsService: AdminReportsService) { }

    connect(): void {
        if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
            return;
        }

        try {
            this.socket = new WebSocket(environment.wsAdminUrl);

            this.socket.onopen = () => {
                this.isConnected.set(true);
            };

            this.socket.onmessage = (event) => {
                try {
                    const data: WebSocketEvent = JSON.parse(event.data);
                    this.handleEvent(data);
                } catch (e) {
                    // Ignorar payloads mal formateados
                }
            };

            this.socket.onclose = () => {
                this.isConnected.set(false);
                if (this.shouldReconnect) {
                    setTimeout(() => this.connect(), this.reconnectInterval);
                }
            };

            this.socket.onerror = () => {
                this.isConnected.set(false);
            };
        } catch (e) {
            this.isConnected.set(false);
        }
    }

    private handleEvent(event: WebSocketEvent): void {
        // Si se actualizó o creó un reporte en tiempo real, sincronizamos con el servicio REST
        if (event.type === 'report.updated' || event.type === 'report.created') {
            this.reportsService.getReports().subscribe();
        }
    }

    disconnect(): void {
        this.shouldReconnect = false;
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
        this.isConnected.set(false);
    }

    ngOnDestroy(): void {
        this.disconnect();
    }
}