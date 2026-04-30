import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface User {
  id: number;
  name: string;
  avatar?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  // Para saber si estamos en navegador o no
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  // Estado de si el usuario está logueado
  isLoggedIn = signal(
    this.isBrowser && localStorage.getItem('isLoggedIn') === 'true'
  );

  // Usuario actual guardado en memoria
  currentUser = signal<User | null>(
    this.isBrowser && localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user')!)
      : null
  );

  constructor() {
    // Carga el estado del login al iniciar
    this.loadAuthState();
  }

  login(user: { id: number; name: string; avatar?: string }) {
    console.log('Login con usuario:', user);

    // Marca como logueado y guarda usuario
    this.isLoggedIn.set(true);
    this.currentUser.set(user);

    if (this.isBrowser) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('isLoggedIn', 'true');
      console.log('Usuario guardado en localStorage:', localStorage.getItem('user'));
    }
  }

  logout() {
    console.log('Logout');

    // Limpia estado
    this.isLoggedIn.set(false);
    this.currentUser.set(null);

    // Borra datos guardados
    if (this.isBrowser) {
      localStorage.removeItem('user');
      localStorage.removeItem('isLoggedIn');
    }
  }

  loadAuthState() {
    if (!this.isBrowser) return;

    // Intenta recuperar usuario guardado
    const user = localStorage.getItem('user');
    console.log('Usuario en localStorage:', user);

    if (user) {
      const parsedUser = JSON.parse(user);
      console.log('Usuario parseado:', parsedUser);

      // Restaura estado de login
      this.currentUser.set(parsedUser);
      this.isLoggedIn.set(true);
    } else {
      // Si no hay usuario, deja todo vacío
      this.currentUser.set(null);
      this.isLoggedIn.set(false);
    }
  }
}