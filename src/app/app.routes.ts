import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Maps } from './pages/maps/maps';
import { Layers } from './pages/layers/layers';
import { Analysis } from './pages/analysis/analysis';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'maps', component: Maps },
  { path: 'layers', component: Layers },
  { path: 'analysis', component: Analysis }
];
