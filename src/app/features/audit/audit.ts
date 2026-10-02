import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface AuditLog {
  id: number;
  timestamp: string;
  usuario: string;
  rol: string;
  modulo: 'Reportes' | 'Mapa' | 'Categorías' | 'Usuarios' | 'Sistema';
  accion: 'CREAR' | 'MODIFICAR' | 'ESTADO' | 'ELIMINAR';
  descripcion: string;
  ip: string;
}

@Component({
  selector: 'app-audit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './audit.html',
  styleUrl: './audit.css',
})
export class Audit {
  busqueda: string = '';
  filtroModulo: string = 'Todos';
  filtroAccion: string = 'Todas';

  logs: AuditLog[] = [
    {
      id: 1042,
      timestamp: '2026-10-01 18:32:10',
      usuario: 's.zuleta',
      rol: 'Administrador',
      modulo: 'Reportes',
      accion: 'ESTADO',
      descripcion: 'Actualización de estado en Reclamo #2 (Luminaria rota) de "Pendiente" a "En proceso"',
      ip: '192.168.1.45'
    },
    {
      id: 1041,
      timestamp: '2026-10-01 17:15:02',
      usuario: 'operador_vialidad',
      rol: 'Inspector de Campo',
      modulo: 'Reportes',
      accion: 'MODIFICAR',
      descripcion: 'Asignación de cuadrilla de bacheo Este al Reclamo #1 (Av. San Martín 1420)',
      ip: '192.168.1.112'
    },
    {
      id: 1040,
      timestamp: '2026-10-01 14:08:44',
      usuario: 's.zuleta',
      rol: 'Administrador',
      modulo: 'Categorías',
      accion: 'CREAR',
      descripcion: 'Alta de nueva subcategoría de servicio: "Desagües Pluviales"',
      ip: '192.168.1.45'
    },
    {
      id: 1039,
      timestamp: '2026-09-30 20:45:19',
      usuario: 'inspeccion_arbolado',
      rol: 'Inspector de Campo',
      modulo: 'Reportes',
      accion: 'ESTADO',
      descripcion: 'Cierre y resolución de acta de Reclamo #3 (Ramas caídas en senda peatonal)',
      ip: '192.168.1.88'
    },
    {
      id: 1038,
      timestamp: '2026-09-30 11:22:30',
      usuario: 'sistema',
      rol: 'Automático',
      modulo: 'Mapa',
      accion: 'MODIFICAR',
      descripcion: 'Sincronización de teselas vectoriales OpenFreeMap y capas de zonificación',
      ip: '127.0.0.1'
    },
    {
      id: 1037,
      timestamp: '2026-09-29 16:10:05',
      usuario: 'm.gomez',
      rol: 'Mesa de Entrada',
      modulo: 'Reportes',
      accion: 'CREAR',
      descripcion: 'Ingreso pericial de Reclamo #4 (Contenedor desbordado en Arístides 480)',
      ip: '192.168.1.33'
    },
    {
      id: 1036,
      timestamp: '2026-09-28 09:14:52',
      usuario: 's.zuleta',
      rol: 'Administrador',
      modulo: 'Sistema',
      accion: 'MODIFICAR',
      descripcion: 'Modificación de parámetros de seguridad en credenciales de acceso',
      ip: '192.168.1.45'
    }
  ];

  get logsFiltrados(): AuditLog[] {
    return this.logs.filter(item => {
      const coincideModulo = this.filtroModulo === 'Todos' || item.modulo === this.filtroModulo;
      const coincideAccion = this.filtroAccion === 'Todas' || item.accion === this.filtroAccion;
      const coincideTexto =
        item.descripcion.toLowerCase().includes(this.busqueda.toLowerCase()) ||
        item.usuario.toLowerCase().includes(this.busqueda.toLowerCase()) ||
        item.id.toString().includes(this.busqueda);

      return coincideModulo && coincideAccion && coincideTexto;
    });
  }
}