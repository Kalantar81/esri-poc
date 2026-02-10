import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { filter, map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SidebarService {
  private readonly menuMap: Record<string, MenuItem[]> = {
    home: [
      {
        label: 'Dashboard',
        icon: 'pi pi-home',
        items: [
          { label: 'Overview', icon: 'pi pi-th-large' },
          { label: 'Recent Items', icon: 'pi pi-clock' },
          { label: 'Favorites', icon: 'pi pi-star' },
        ],
      },
      {
        label: 'Quick Actions',
        icon: 'pi pi-bolt',
        items: [
          { label: 'New Map', icon: 'pi pi-map', routerLink: '/maps' },
          { label: 'Import Data', icon: 'pi pi-upload' },
        ],
      },
    ],
    maps: [
      {
        label: 'Map Tools',
        icon: 'pi pi-map-marker',
        items: [
          { label: 'Basemaps', icon: 'pi pi-globe' },
          { label: 'Measure', icon: 'pi pi-ruler' },
          { label: 'Draw', icon: 'pi pi-pencil' },
        ],
      },
      {
        label: 'Data',
        icon: 'pi pi-database',
        items: [
          { label: 'Import', icon: 'pi pi-upload' },
          { label: 'Export', icon: 'pi pi-download' },
          { label: 'Query', icon: 'pi pi-search' },
        ],
      },
    ],
    layers: [
      {
        label: 'Layer Management',
        icon: 'pi pi-layer-group',
        items: [
          { label: 'Add Layer', icon: 'pi pi-plus' },
          { label: 'Layer List', icon: 'pi pi-list' },
          { label: 'Symbology', icon: 'pi pi-palette' },
        ],
      },
      {
        label: 'Layer Settings',
        icon: 'pi pi-cog',
        items: [
          { label: 'Visibility', icon: 'pi pi-eye' },
          { label: 'Opacity', icon: 'pi pi-sliders-h' },
          { label: 'Labeling', icon: 'pi pi-tag' },
        ],
      },
    ],
    analysis: [
      {
        label: 'Spatial Analysis',
        icon: 'pi pi-chart-bar',
        items: [
          { label: 'Buffer', icon: 'pi pi-circle' },
          { label: 'Overlay', icon: 'pi pi-clone' },
          { label: 'Proximity', icon: 'pi pi-arrows-alt' },
        ],
      },
      {
        label: 'Results',
        icon: 'pi pi-table',
        items: [
          { label: 'View Results', icon: 'pi pi-eye' },
          { label: 'Export Report', icon: 'pi pi-file-export' },
        ],
      },
    ],
  };

  readonly menuItems$: Observable<MenuItem[]>;

  constructor(private router: Router) {
    this.menuItems$ = this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      startWith(null),
      map(() => {
        const route = this.router.url.split('/')[1] || 'home';
        return this.menuMap[route] ?? this.menuMap['home'];
      })
    );
  }
}
