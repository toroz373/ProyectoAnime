import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// Servicio de autenticación - maneja el login/logout de usuarios
@Injectable({ providedIn: 'root' })
export class AuthService {
  // Detectar si estamos en navegador (para poder usar localStorage)
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  // State: Indica si hay un usuario logueado
  isLoggedIn = signal(false);
  
  // State: Almacena los datos del usuario actual (id y nombre)
  currentUser = signal<{ id: number; name: string } | null>(null);

  // Método para iniciar sesión - guarda el usuario y lo persiste en localStorage
  login(user: { id: number; name: string }) {
    this.isLoggedIn.set(true);
    this.currentUser.set(user);
    
    if (this.isBrowser) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('isLoggedIn', 'true');
    }
  }

  // Método para cerrar sesión - limpia el usuario y lo elimina de localStorage
  logout() {
    this.isLoggedIn.set(false);
    this.currentUser.set(null);
    
    if (this.isBrowser) {
      localStorage.removeItem('user');
      localStorage.removeItem('isLoggedIn');
    }
  }

  // Método para cargar el estado guardado de la sesión anterior
  loadAuthState() {
    if (!this.isBrowser) {
      return;
    }

    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const user = localStorage.getItem('user');
    
    // Si había una sesión guardada, restaurarla
    if (isLoggedIn && user) {
      this.isLoggedIn.set(true);
      this.currentUser.set(JSON.parse(user));
    }
  }
}
