// Componente de feed pubblico (sin autenticacion)
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimeService } from '../../core/services/anime';
import { AnimeCardComponent } from '../anime-card/anime-card';
import { AuthService } from '../../core/services/auth';
import { HeaderComponent } from '../header/header';

@Component({
  selector: 'app-public-feed',
  standalone: true,
  imports: [AnimeCardComponent, CommonModule, HeaderComponent],
  templateUrl: './public-feed.html',
  styleUrl: './public-feed.css'
})
export class PublicFeedComponent {

  // Inyectar servicio de autenticacion
  protected authService = inject(AuthService);

  constructor(protected animeService: AnimeService) {}

  ngOnInit() {
    // Always use light mode in public feed
    document.body.classList.remove('dark-mode');
  }

  // En el feed pubblico el ID de usuario es siempre 0
  get currentUserId(): number {
    return 0;
  }

  // Obtener lista de animes filtrados
  get animes() {
    return this.animeService.filteredAnimes;
  }

  // Estados para el menu de ordenamiento
  isSortOpen = false;
  selectedSortLabel = 'Valoraciones';

  // Alternar menu de ordenamiento
  toggleSort() {
    this.isSortOpen = !this.isSortOpen;
  }

  // Seleccionar opcion de ordenamiento
  selectSort(option: 'rating' | 'az') {
    this.animeService.setSortOption(option);
    this.selectedSortLabel = option === 'rating' ? 'Valoraciones' : 'A-Z';
    this.isSortOpen = false;
  }
}
