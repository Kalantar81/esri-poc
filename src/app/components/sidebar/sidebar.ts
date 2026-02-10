import { Component } from '@angular/core';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-sidebar',
  imports: [PanelMenuModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  sideMenuItems: MenuItem[] = [
    {
      label: 'Map Tools',
      icon: 'pi pi-map-marker',
      items: [
        { label: 'Basemaps', icon: 'pi pi-globe' },
        { label: 'Measure', icon: 'pi pi-ruler' },
        { label: 'Draw', icon: 'pi pi-pencil' }
      ]
    },
    {
      label: 'Data',
      icon: 'pi pi-database',
      items: [
        { label: 'Import', icon: 'pi pi-upload' },
        { label: 'Export', icon: 'pi pi-download' },
        { label: 'Query', icon: 'pi pi-search' }
      ]
    },
    {
      label: 'Settings',
      icon: 'pi pi-cog',
      items: [
        { label: 'Preferences', icon: 'pi pi-sliders-h' },
        { label: 'Account', icon: 'pi pi-user' }
      ]
    }
  ];
}
