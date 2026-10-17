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
    { id: 2, lat: -32.8930, lng: -68.8410, titulo: 'Luminaria rota', categoria: 'Alumbrado', estado: 'En proceso' },
    { id: 3, lat: -32.8850, lng: -68.8520, titulo: 'Ramas caídas sobre senda peatonal', categoria: 'Arbolado', estado: 'Resuelto' },
    { id: 4, lat: -32.8980, lng: -68.8350, titulo: 'Contenedor desbordado', categoria: 'Higiene Urbana', estado: 'Pendiente' },
    { id: 5, lat: -32.8900, lng: -68.8400, titulo: 'Pérdida de agua sobre calzada', categoria: 'Obras y Agua', estado: 'En proceso' }
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
      // Creación segura de elementos DOM sin setHTML vulnerable
      const popupNode = document.createElement('div');
      popupNode.style.fontFamily = 'inherit';
      popupNode.style.color = '#0f172a';
      popupNode.style.padding = '4px';

      const titleNode = document.createElement('h4');
      titleNode.style.margin = '0 0 6px 0';
      titleNode.style.fontSize = '14px';
      titleNode.style.fontWeight = '700';
      titleNode.textContent = item.titulo;

      const catNode = document.createElement('p');
      catNode.style.margin = '0 0 4px 0';
      catNode.style.fontSize = '12px';
      catNode.style.color = '#475569';
      catNode.textContent = `Categoría: ${item.categoria}`;

      const statusNode = document.createElement('span');
      statusNode.style.display = 'inline-block';
      statusNode.style.padding = '2px 8px';
      statusNode.style.borderRadius = '4px';
      statusNode.style.fontSize = '11px';
      statusNode.style.fontWeight = '600';
      statusNode.style.background = '#e2e8f0';
      statusNode.style.color = '#1e293b';
      statusNode.textContent = item.estado;

      popupNode.appendChild(titleNode);
      popupNode.appendChild(catNode);
      popupNode.appendChild(statusNode);

      const popup = new maplibregl.Popup({ offset: 25 }).setDOMContent(popupNode);

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