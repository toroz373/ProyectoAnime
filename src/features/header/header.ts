import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { AnimeService } from '../../core/services/anime';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class HeaderComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  private animeService = inject(AnimeService);

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.animeService.setSearchTerm(value);
  }
}
