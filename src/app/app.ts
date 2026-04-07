import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../core/services/auth';
import { HeaderComponent } from '../core/layout/header';

// Componente raíz de toda la aplicación
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  // Título de la aplicación
  protected readonly title = signal('MiruZone');
  private authService = inject(AuthService);

  // Al iniciar: cargar el estado de la sesión anterior
  ngOnInit() {
    this.authService.loadAuthState();
  }
}
