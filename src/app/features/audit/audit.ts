import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminAuditService } from '../../core/services/admin-audit.service';

@Component({
  selector: 'app-audit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './audit.html',
  styleUrl: './audit.css',
})
export class Audit implements OnInit {
  busqueda: string = '';
  filtroModulo: string = 'Todos';
  filtroAccion: string = 'Todas';

  constructor(public auditService: AdminAuditService) { }

  ngOnInit(): void {
    this.cargarLogs();
  }

  cargarLogs(): void {
    this.auditService.getAuditLogs({
      search: this.busqueda || undefined,
      module: this.filtroModulo,
      action: this.filtroAccion
    }).subscribe();
  }

  onFiltroChange(): void {
    this.cargarLogs();
  }
}