import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';

// Componente de encabezado - contiene el logo, buscador y botones de login/logout
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class HeaderComponent {
  protected authService = inject(AuthService);
  private router = inject(Router);

  // Función para buscar (actualmente no implementada)
  search(event: Event) {
    const query = (event.target as HTMLInputElement).value;
    console.log('Buscar:', query);
  }

  // Iniciar sesión: mostrar usuario de demos y redirigir a página privada
  login() {
    this.authService.login({ id: 1, name: 'Demo User' });
    this.router.navigate(['/private']);
  }

  // Cerrar sesión: limpiar usuario y redirigir a página pública
  logout() {
    this.authService.logout();
    this.router.navigate(['']);
  }
}
