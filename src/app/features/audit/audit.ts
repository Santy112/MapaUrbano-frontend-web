import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminAuditService } from '../../core/services/admin-audit.service';
import { AdminAuditEntry } from '../../core/models/api.models';

@Component({
  selector: 'app-audit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './audit.html',
  styleUrl: './audit.css',
})
export class Audit implements OnInit {
  busqueda: string = '';

  constructor(public auditService: AdminAuditService) { }

  ngOnInit(): void {
    this.cargarLogs();
  }

  cargarLogs(cursor?: string): void {
    this.auditService.getAuditLogs(cursor).subscribe();
  }

  get logsFiltrados(): AdminAuditEntry[] {
    const term = this.busqueda.trim().toLowerCase();
    const list = this.auditService.logs();
    if (!term) {
      return list;
    }
    return list.filter(item =>
      item.details.toLowerCase().includes(term) ||
      (item.actor && item.actor.toLowerCase().includes(term)) ||
      item.module.toLowerCase().includes(term) ||
      item.action.toLowerCase().includes(term)
    );
  }
}