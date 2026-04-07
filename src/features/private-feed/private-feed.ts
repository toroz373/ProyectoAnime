import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimeService } from '../../core/services/anime';
import { AnimeCardComponent } from '../anime-card/anime-card';
import { AuthService } from '../../core/services/auth';

// Componente de feed privado - muestra tarjetas permitiendo comentar y valorar
@Component({
  selector: 'app-private-feed',
  standalone: true,
  imports: [AnimeCardComponent, CommonModule],
  templateUrl: './private-feed.html',
  styleUrl: './private-feed.css'
})
export class PrivateFeedComponent {
  // Para acceder al estado del login y datos del usuario
  protected authService = inject(AuthService);

  constructor(protected animeService: AnimeService) {}

  // Obtener la lista de todos los animes
  get animes() {
    return this.animeService.getAnimes;
  }
}
