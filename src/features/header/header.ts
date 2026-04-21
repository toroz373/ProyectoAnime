import { Component, inject } from '@angular/core';
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

  constructor() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const url = event.urlAfterRedirects;

        const hiddenRoutes = ['/ajustes'];
        this.showSearch = !hiddenRoutes.some(route => url.startsWith(route));

        // 🔥 NUEVO: control del logo
        this.showLogoLink = !url.startsWith('/public-feed');
      });
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
