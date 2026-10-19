import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { AdminReportsService } from '../../core/services/admin-reports.service';

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

  constructor(public reportsService: AdminReportsService) { }

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
      zoom: 14,
      pitch: 45,
      bearing: -10
    });

    this.map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right');

    this.map.on('load', () => {
      this.map.resize();
      this.cargarMarcadoresReales();
    });
  }

  private cargarMarcadoresReales(): void {
    this.reportsService.getReports({ limit: 50 }).subscribe({
      next: (res) => {
        res.items.forEach(item => {
          if (!item.latitude || !item.longitude) return;

          const popupNode = document.createElement('div');
          popupNode.style.fontFamily = 'inherit';
          popupNode.style.color = '#0f172a';
          popupNode.style.padding = '4px';

          const titleNode = document.createElement('h4');
          titleNode.style.margin = '0 0 6px 0';
          titleNode.style.fontSize = '14px';
          titleNode.style.fontWeight = '700';
          titleNode.textContent = item.title;

          const catNode = document.createElement('p');
          catNode.style.margin = '0 0 4px 0';
          catNode.style.fontSize = '12px';
          catNode.style.color = '#475569';
          catNode.textContent = `Categoría: ${item.categorySlug} | Prioridad: ${item.priority}`;

          const statusNode = document.createElement('span');
          statusNode.style.display = 'inline-block';
          statusNode.style.padding = '2px 8px';
          statusNode.style.borderRadius = '4px';
          statusNode.style.fontSize = '11px';
          statusNode.style.fontWeight = '600';
          statusNode.style.background = '#e2e8f0';
          statusNode.style.color = '#1e293b';
          statusNode.textContent = item.status;

          popupNode.appendChild(titleNode);
          popupNode.appendChild(catNode);
          popupNode.appendChild(statusNode);

          const popup = new maplibregl.Popup({ offset: 25 }).setDOMContent(popupNode);

          new maplibregl.Marker({ color: item.status === 'RESOLVED' ? '#16a34a' : '#2563eb' })
            .setLngLat([item.longitude, item.latitude])
            .setPopup(popup)
            .addTo(this.map);
        });
      }
    });
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }
}