import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;
  reportesActivos: number;
  color: string;
}

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories {
  nuevaCategoria: string = '';
  nuevaDescripcion: string = '';
  nuevoColor: string = '#2563eb';

  categorias: Categoria[] = [
    { id: 1, nombre: 'Vialidad', descripcion: 'Baches, calzadas deterioradas, señalética y reductores de velocidad', reportesActivos: 14, color: '#ef4444' },
    { id: 2, nombre: 'Alumbrado', descripcion: 'Farolas apagadas, focos intermitentes y cableado aéreo', reportesActivos: 8, color: '#f59e0b' },
    { id: 3, nombre: 'Arbolado', descripcion: 'Poda de ramas bajas, árboles secos y despeje de tendido', reportesActivos: 5, color: '#10b981' },
    { id: 4, nombre: 'Higiene Urbana', descripcion: 'Microbasurales, contenedores rotos y limpieza de acequias', reportesActivos: 11, color: '#06b6d4' },
    { id: 5, nombre: 'Obras y Agua', descripcion: 'Pérdidas de agua en vía pública y roturas de vereda', reportesActivos: 6, color: '#8b5cf6' }
  ];

  agregarCategoria(): void {
    if (!this.nuevaCategoria.trim()) return;

    this.categorias.push({
      id: Date.now(),
      nombre: this.nuevaCategoria.trim(),
      descripcion: this.nuevaDescripcion.trim() || 'Sin descripción adicional',
      reportesActivos: 0,
      color: this.nuevoColor
    });

    this.nuevaCategoria = '';
    this.nuevaDescripcion = '';
    this.nuevoColor = '#2563eb';
  }

  eliminarCategoria(id: number): void {
    this.categorias = this.categorias.filter(cat => cat.id !== id);
  }
}