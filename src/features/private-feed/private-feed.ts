import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimeService } from '../../core/services/anime';
import { AnimeCardComponent } from '../anime-card/anime-card';
import { AuthService } from '../../core/services/auth';
import { HeaderComponent } from '../header/header';
import { SidebarComponent } from '../sidebar/sidebar';

// Componente de feed privado - muestra tarjetas permitiendo comentar y valorar
@Component({
  selector: 'app-private-feed',
  standalone: true,
  imports: [AnimeCardComponent, CommonModule, SidebarComponent, HeaderComponent ],
  templateUrl: './private-feed.html',
  styleUrl: './private-feed.css'
})
export class PrivateFeedComponent {
  // Para acceder al estado del login y datos del usuario
  protected authService = inject(AuthService);

  constructor(protected animeService: AnimeService) {}

  // Exponer el currentUserId explícitamente
  get currentUserId(): number {
    const user = this.authService.currentUser();
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
