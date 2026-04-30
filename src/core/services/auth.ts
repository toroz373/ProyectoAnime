// Servicio de autenticacion - gestiona el estado del usuario
import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// Interfaz para el usuario
export interface User {
  id: number;
  name: string;
  avatar?: string;
}

// Servicio inyectable disponible en toda la app
@Injectable({ providedIn: 'root' })
export class AuthService {

  // Detectar si estamos en navegador o en servidor
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  // Signal para el estado de login
  isLoggedIn = signal(
    this.isBrowser && localStorage.getItem('isLoggedIn') === 'true'
  );

  // Signal para el usuario actual
  currentUser = signal<User | null>(
    this.isBrowser && localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user')!)
      : null
  );

  constructor() {
    // Cargar estado al iniciar
    this.loadAuthState();
  }

  // Metodo para iniciar sesion
  login(user: { id: number; name: string; avatar?: string }) {
    console.log('Login con usuario:', user);

    // Actualizar signals
    this.isLoggedIn.set(true);
    this.currentUser.set(user);

    // Guardar en localStorage si estamos en navegador
    if (this.isBrowser) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('isLoggedIn', 'true');
      console.log('Usuario guardado en localStorage:', localStorage.getItem('user'));
    }
  }

  // Metodo para cerrar sesion
  logout() {
    console.log('Logout');

    // Limpiar signals
    this.isLoggedIn.set(false);
    this.currentUser.set(null);

    // Eliminar de localStorage
    if (this.isBrowser) {
      localStorage.removeItem('user');
      localStorage.removeItem('isLoggedIn');
    }
  }

  // Cargar estado desde localStorage
  loadAuthState() {
    if (!this.isBrowser) return;

    // Intentar recuperar usuario
    const user = localStorage.getItem('user');
    console.log('Usuario en localStorage:', user);

    if (user) {
      const parsedUser = JSON.parse(user);
      console.log('Usuario parseado:', parsedUser);

      // Restaurar estado
      this.currentUser.set(parsedUser);
      this.isLoggedIn.set(true);
    } else {
      // Dejar vacio
      this.currentUser.set(null);
      this.isLoggedIn.set(false);
    }
  }
}