import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { PanelMenuModule } from 'primeng/panelmenu';
import { SidebarService } from './sidebar.service';

@Component({
  selector: 'app-sidebar',
  imports: [PanelMenuModule, AsyncPipe],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  private sidebarService = inject(SidebarService);
  sideMenuItems$ = this.sidebarService.menuItems$;
}
