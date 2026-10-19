import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminReportsService } from '../../core/services/admin-reports.service';
import { AdminTeamsService } from '../../core/services/admin-teams.service';
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

  constructor(
    public reportsService: AdminReportsService,
    public teamsService: AdminTeamsService
  ) { }

  ngOnInit(): void {
    this.cargarReportes();
    this.teamsService.getTeams().subscribe();
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
        if (err.status === 409) {
          this.conflictError = `Conflicto en Acta: otro operador modificó el expediente. Recargando datos...`;
          this.cargarReportes();
        }
      }
    });
  }

  asignarEquipo(reporte: AdminReport, teamId: string): void {
    reporte.assignedTeamId = teamId;
  }

  eliminarReporte(id: string): void {
    if (confirm(`¿Confirma la anulación/baja del Acta? Esta acción no se puede deshacer.`)) {
      this.reportsService.deleteReport(id).subscribe(() => {
        if (this.reporteSeleccionado?.id === id) {
          this.cerrarDetalle();
        }
      });
    }
  }

  verDetalle(reporte: AdminReport): void {
    this.reporteSeleccionado = reporte;
  }

  cerrarDetalle(): void {
    this.reporteSeleccionado = null;
  }
}