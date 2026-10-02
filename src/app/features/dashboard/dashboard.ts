import { Component, AfterViewInit, OnDestroy } from '@angular/core';

declare const maplibregl: any;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements AfterViewInit, OnDestroy {
  private map: any;

  incidencias = [
    { id: 1, lat: -32.8895, lng: -68.8458, titulo: 'Bache en calzada principal', categoria: 'Vialidad', estado: 'Pendiente' },
    { id: 2, lat: -32.8930, lng: -68.8410, titulo: 'Luminaria apagada en plaza', categoria: 'Alumbrado', estado: 'En proceso' },
    { id: 3, lat: -32.8850, lng: -68.8520, titulo: 'Ramas caídas obstruyendo vereda', categoria: 'Arbolado', estado: 'Resuelto' },
    { id: 4, lat: -32.8980, lng: -68.8350, titulo: 'Contenedor desbordado', categoria: 'Higiene', estado: 'Pendiente' }
  ];

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initMap();
    }, 100);
  }

  private initMap(): void {
    if (typeof maplibregl === 'undefined') {
      return;
    }

    // Estilo a color nítido (liberty) con soporte 3D
    this.map = new maplibregl.Map({
      container: 'map',
      style: 'https://tiles.openfreemap.org/styles/liberty',
      center: [-68.8458, -32.8908],
      zoom: 15,
      pitch: 45,
      bearing: -10
    });

    this.map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right');

    this.map.on('load', () => {
      this.map.resize();
    });

    this.incidencias.forEach(item => {
      const popup = new maplibregl.Popup({ offset: 25 }).setHTML(`
        <div style="font-family: inherit; color: #0f172a; padding: 4px;">
          <h4 style="margin: 0 0 6px 0; font-size: 14px; font-weight: 700;">${item.titulo}</h4>
          <p style="margin: 0 0 4px 0; font-size: 12px; color: #475569;"><strong>Categoría:</strong> ${item.categoria}</p>
          <span style="display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 600; background: #e2e8f0; color: #1e293b;">${item.estado}</span>
        </div>
      `);

      new maplibregl.Marker({ color: '#2563eb' })
        .setLngLat([item.lng, item.lat])
        .setPopup(popup)
        .addTo(this.map);
    });
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }
}