// Componente de feed privado (requiere autenticacion)
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
  // Inyectar servicio de autenticacion
  protected authService = inject(AuthService);

  constructor(protected animeService: AnimeService) {}

  // Obtener ID del usuario actual
  get currentUserId(): number {
    const user = this.authService.currentUser();
    return user?.id ?? 0;
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
