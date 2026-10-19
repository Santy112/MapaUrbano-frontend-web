import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminCategoriesService } from '../../core/services/admin-categories.service';
import { AdminCategory } from '../../core/models/api.models';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categories.html',
  styleUrl: './categories.css'
})
export class Categories implements OnInit {
  nuevaCategoria = {
    name: '',
    slug: '',
    colorHex: '#2563eb',
    sortOrder: 1,
    isActive: true
  };

  errorMensaje = '';

  constructor(public categoriesService: AdminCategoriesService) { }

  ngOnInit(): void {
    this.categoriesService.getCategories().subscribe();
  }

  generarSlug(): void {
    this.nuevaCategoria.slug = this.nuevaCategoria.name
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  crearCategoria(): void {
    if (!this.nuevaCategoria.name.trim() || !this.nuevaCategoria.slug.trim()) {
      this.errorMensaje = 'El nombre y el slug técnico son obligatorios.';
      return;
    }

    const existeSlug = this.categoriesService.categories().some(c => c.slug === this.nuevaCategoria.slug);
    if (existeSlug) {
      this.errorMensaje = `Ya existe una categoría con el slug "${this.nuevaCategoria.slug}".`;
      return;
    }

    this.errorMensaje = '';
    this.categoriesService.createCategory({
      name: this.nuevaCategoria.name,
      slug: this.nuevaCategoria.slug,
      colorHex: this.nuevaCategoria.colorHex,
      sortOrder: Number(this.nuevaCategoria.sortOrder),
      isActive: this.nuevaCategoria.isActive
    }).subscribe({
      next: () => {
        this.nuevaCategoria = {
          name: '',
          slug: '',
          colorHex: '#2563eb',
          sortOrder: this.categoriesService.categories().length + 1,
          isActive: true
        };
      },
      error: (err) => {
        this.errorMensaje = err.error?.message || 'Error al crear la categoría.';
      }
    });
  }

  toggleEstado(cat: AdminCategory): void {
    this.categoriesService.updateCategory(cat.id, { isActive: !cat.isActive }).subscribe();
  }
}