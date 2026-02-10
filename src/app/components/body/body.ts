import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-body',
  imports: [RouterOutlet, Sidebar],
  templateUrl: './body.html',
  styleUrl: './body.scss',
})
export class Body {}
