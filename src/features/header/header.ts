import { Component, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../../core/services/auth';
import { AnimeService } from '../../core/services/anime';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class HeaderComponent {

  private router = inject(Router);
  private authService = inject(AuthService);
  private animeService = inject(AnimeService);

  showSearch = true;
  showLogoLink = true;

  // control de sesión
  isLoggedIn = false;

  avatarUrl: string = 'assets/default-avatar.png';

  constructor() {

    // usuario + avatar
    effect(() => {
      const user = this.authService.currentUser();

      this.isLoggedIn = !!user;

      if (user?.avatar) {
        this.avatarUrl = this.getAvatarUrl(user.avatar);
      } else {
        this.avatarUrl = 'assets/default-avatar.png';
      }
    });

    // navegación
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const url = event.urlAfterRedirects;

        const hiddenRoutes = ['/ajustes'];

        this.showSearch = !hiddenRoutes.some(route => url.startsWith(route));

        this.showLogoLink = !url.startsWith('/public-feed');

        // OCULTAR AVATAR EN PUBLIC FEED
        if (url.startsWith('/public-feed')) {
          this.isLoggedIn = false;
        }
      });
  }

  private getAvatarUrl(avatar: string): string {
    if (avatar.startsWith('data:') || avatar.startsWith('http')) {
      return avatar;
    }

    const BASE_URL = 'http://localhost/ProyectoAnime/backend-php/uploads/';
    return BASE_URL + avatar;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.animeService.setSearchTerm(value);
  }
}
