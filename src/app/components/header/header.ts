import { Component } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-header',
  imports: [MenubarModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  menuItems: MenuItem[] = [
    { label: 'Home', icon: 'pi pi-home', routerLink: '/home' },
    { label: 'Maps', icon: 'pi pi-map', routerLink: '/maps' },
    { label: 'Layers', icon: 'pi pi-layer-group', routerLink: '/layers' },
    { label: 'Analysis', icon: 'pi pi-chart-bar', routerLink: '/analysis' }
  ];
}
