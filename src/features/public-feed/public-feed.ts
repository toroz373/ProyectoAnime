import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimeService } from '../../core/services/anime';
import { AnimeCardComponent } from '../anime-card/anime-card';
import { AuthService } from '../../core/services/auth';
import { HeaderComponent } from '../header/header';

// Componente de feed público - muestra todas las tarjetas sin permitir comentar/valorar
@Component({
  selector: 'app-public-feed',
  standalone: true,
  imports: [AnimeCardComponent, CommonModule, HeaderComponent],
  templateUrl: './public-feed.html',
  styleUrl: './public-feed.css'
})
export class PublicFeedComponent {
  // Para acceder al estado del login
  protected authService = inject(AuthService);

  constructor(protected animeService: AnimeService) {}

  ngOnInit() {
    document.body.classList.remove('dark-mode');
  }

  // Exponer el currentUserId explícitamente
  get currentUserId(): number {
    const user = this.authService.currentUser();
    console.log('PublicFeedComponent - currentUserId getter, user:', user);
    return user?.id ?? 0;
  }

  // Obtener la lista de todos los animes
  get animes() {
    return this.animeService.filteredAnimes;
  }
  
  isSortOpen = false;

  selectedSortLabel = 'Valoraciones';

  toggleSort() {
    this.isSortOpen = !this.isSortOpen;
  }

  selectSort(option: 'rating' | 'az') {
    this.animeService.setSortOption(option);

    this.selectedSortLabel = option === 'rating' ? 'Valoraciones' : 'A-Z';

    this.isSortOpen = false;
  }
}
