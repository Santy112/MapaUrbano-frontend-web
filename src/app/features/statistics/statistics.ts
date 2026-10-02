import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CategoriaMetrica {
  nombre: string;
  total: number;
  porcentaje: number;
  color: string;
}

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './statistics.html',
  styleUrl: './statistics.css',
})
export class Statistics {
  totalReportes: number = 42;
  resueltos: number = 29;
  enProceso: number = 9;
  pendientes: number = 4;
  tiempoPromedioDias: number = 2.4;

  categorias: CategoriaMetrica[] = [
    { nombre: 'Vialidad', total: 15, porcentaje: 36, color: '#ef4444' },
    { nombre: 'Alumbrado', total: 11, porcentaje: 26, color: '#f59e0b' },
    { nombre: 'Higiene Urbana', total: 8, porcentaje: 19, color: '#06b6d4' },
    { nombre: 'Obras y Agua', total: 5, porcentaje: 12, color: '#8b5cf6' },
    { nombre: 'Arbolado', total: 3, porcentaje: 7, color: '#10b981' }
  ];

  get porcentajeResolucion(): number {
    return Math.round((this.resueltos / this.totalReportes) * 100);
  }
}
