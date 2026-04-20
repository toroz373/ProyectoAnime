import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  isLoggedIn = signal(
    this.isBrowser && localStorage.getItem('isLoggedIn') === 'true'
  );
  currentUser = signal<{ id: number; name: string } | null>(
    this.isBrowser && localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user')!)
      : null
  );

  constructor() {
    this.loadAuthState(); //  IMPORTANTE
  }

  login(user: { id: number; name: string }) {
    console.log('AuthService.login called with user:', user);
    this.isLoggedIn.set(true);
    this.currentUser.set(user);

    if (this.isBrowser) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('isLoggedIn', 'true');
      console.log('User saved to localStorage:', localStorage.getItem('user'));
    }
  }

  logout() {
    console.log('AuthService.logout called');
    this.isLoggedIn.set(false);
    this.currentUser.set(null);

    if (this.isBrowser) {
      localStorage.removeItem('user');
      localStorage.removeItem('isLoggedIn');
    }
  }

  loadAuthState() {
    if (!this.isBrowser) return;

    const user = localStorage.getItem('user');
    console.log('AuthService.loadAuthState - user from localStorage:', user);

    if (user) {
      const parsedUser = JSON.parse(user);
      console.log('Parsed user:', parsedUser);
      this.currentUser.set(parsedUser);
      this.isLoggedIn.set(true);
    } else {
      this.currentUser.set(null);
      this.isLoggedIn.set(false);
    }
  }
}
