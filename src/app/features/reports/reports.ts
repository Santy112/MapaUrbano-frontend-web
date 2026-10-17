import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminReportsService } from '../../core/services/admin-reports.service';
import { AdminReport, ReportStatus } from '../../core/models/api.models';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reports.html',
  styleUrl: './reports.css',
})
export class Reports implements OnInit {
  busqueda: string = '';
  filtroEstado: string = 'Todos';
  reporteSeleccionado: AdminReport | null = null;
  conflictError: string | null = null;

  constructor(public reportsService: AdminReportsService) { }

  ngOnInit(): void {
    this.cargarReportes();
  }

  cargarReportes(): void {
    this.conflictError = null;
    this.reportsService.getReports({
      search: this.busqueda || undefined,
      status: this.filtroEstado !== 'Todos' ? this.filtroEstado : undefined
    }).subscribe();
  }

  onFiltroEstadoChange(estado: string): void {
    this.filtroEstado = estado;
    this.cargarReportes();
  }

  onBuscar(): void {
    this.cargarReportes();
  }

  cambiarEstado(reporte: AdminReport, nuevoEstado: string): void {
    this.conflictError = null;
    this.reportsService.updateStatus(reporte.id, nuevoEstado as ReportStatus, reporte.version).subscribe({
      next: (actualizado) => {
        reporte.status = actualizado.status;
        reporte.version = actualizado.version;
      },
      error: (err) => {
        if (err.message === 'CONFLICT_409') {
          this.conflictError = `Conflicto en Acta #${reporte.id}: otro operador modificó el expediente. Recargando datos...`;
          this.cargarReportes();
        }
      }
    });
  }

  verDetalle(reporte: AdminReport): void {
    this.reporteSeleccionado = reporte;
  }

  cerrarDetalle(): void {
    this.reporteSeleccionado = null;
  }
}