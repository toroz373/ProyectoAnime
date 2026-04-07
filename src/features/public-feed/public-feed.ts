import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimeService } from '../../core/services/anime';
import { AnimeCardComponent } from '../anime-card/anime-card';
import { AuthService } from '../../core/services/auth';

// Componente de feed público - muestra todas las tarjetas sin permitir comentar/valorar
@Component({
  selector: 'app-public-feed',
  standalone: true,
  imports: [AnimeCardComponent, CommonModule],
  templateUrl: './public-feed.html',
  styleUrl: './public-feed.css'
})
export class PublicFeedComponent {
  // Para acceder al estado del login
  protected authService = inject(AuthService);

  constructor(protected animeService: AnimeService) {}

  // Obtener la lista de todos los animes
  get animes() {
    return this.animeService.getAnimes;
  }
}
