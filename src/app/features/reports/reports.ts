import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Reporte {
  id: number;
  titulo: string;
  categoria: string;
  direccion: string;
  fecha: string;
  estado: 'Pendiente' | 'En proceso' | 'Resuelto';
  imagenUrl: string;
  descripcion: string;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reports.html',
  styleUrl: './reports.css',
})
export class Reports {
  busqueda: string = '';
  filtroEstado: string = 'Todos';
  reporteSeleccionado: Reporte | null = null;

  reportes: Reporte[] = [
    {
      id: 1,
      titulo: 'Bache profundo en calzada',
      categoria: 'Vialidad',
      direccion: 'Av. San Martín 1420',
      fecha: '2026-10-01',
      estado: 'Pendiente',
      imagenUrl: '/bachejpg.jpg',
      descripcion: 'Hundimiento pronunciado de capa asfáltica con desprendimiento de grava en carril vehicular.'
    },
    {
      id: 2,
      titulo: 'Luminaria rota',
      categoria: 'Alumbrado',
      direccion: 'Plaza Independencia (sector este)',
      fecha: '2026-09-30',
      estado: 'En proceso',
      imagenUrl: '/iluminariajpg.jpg',
      descripcion: 'Artefacto lumínico con tulipa destrozada y cableado expuesto tras temporal.'
    },
    {
      id: 3,
      titulo: 'Ramas caídas sobre senda peatonal',
      categoria: 'Arbolado',
      direccion: 'Calle Belgrano y Emilio Civit',
      fecha: '2026-09-29',
      estado: 'Resuelto',
      imagenUrl: '/rama-caidajpg.jpg',
      descripcion: 'Desprendimiento de ramas de porte medio que obstruyen el libre tránsito peatonal en vereda.'
    },
    {
      id: 4,
      titulo: 'Contenedor desbordado',
      categoria: 'Higiene Urbana',
      direccion: 'Arístides Villanueva 480',
      fecha: '2026-09-29',
      estado: 'Pendiente',
      imagenUrl: '/contenedor.jpg',
      descripcion: 'Acumulación de residuos y desborde en el punto de contenedores municipales.'
    },
    {
      id: 5,
      titulo: 'Pérdida de agua sobre calzada',
      categoria: 'Obras y Agua',
      direccion: 'Colón y Patricias Mendocinas',
      fecha: '2026-09-28',
      estado: 'En proceso',
      imagenUrl: '/perdida-aguajpg.jpg',
      descripcion: 'Rotura subterránea de red distribuidora con flujo constante sobre asfalto y cuneta.'
    }
  ];

  get reportesFiltrados(): Reporte[] {
    return this.reportes.filter(r => {
      const coincideEstado = this.filtroEstado === 'Todos' || r.estado === this.filtroEstado;
      const coincideTexto = r.titulo.toLowerCase().includes(this.busqueda.toLowerCase()) ||
        r.direccion.toLowerCase().includes(this.busqueda.toLowerCase()) ||
        r.categoria.toLowerCase().includes(this.busqueda.toLowerCase());
      return coincideEstado && coincideTexto;
    });
  }

  cambiarEstado(reporte: Reporte, nuevoEstado: 'Pendiente' | 'En proceso' | 'Resuelto'): void {
    reporte.estado = nuevoEstado;
  }

  verDetalle(reporte: Reporte): void {
    this.reporteSeleccionado = reporte;
  }

  cerrarDetalle(): void {
    this.reporteSeleccionado = null;
  }
}