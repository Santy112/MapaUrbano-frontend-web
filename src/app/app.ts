import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { Sidebar } from './shared/sidebar/sidebar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Sidebar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'Mapa Urbano';

  constructor(public router: Router) { }

  get isLoginRoute(): boolean {
    return this.router.url.includes('/login');
  }
}