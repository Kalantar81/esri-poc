import { Component } from '@angular/core';
import { MapComponent } from './map/map.component';

@Component({
  selector: 'app-maps',
  imports: [MapComponent],
  templateUrl: './maps.html',
  styleUrl: './maps.scss',
  standalone: true
})
export class Maps {
}
