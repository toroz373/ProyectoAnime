import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AnimeStatus } from '../../features/anime-card/anime-card';

@Injectable({ providedIn: 'root' })
export class EstadoService {

  private http = inject(HttpClient);

  private statusUrl = 'http://localhost/ProyectoAnime/backend-php/api/estado.php';

  // Obtener estado de un anime concreto
  getEstado(userId: number, animeId: number): Observable<{ status: AnimeStatus } | null> {
    return this.http.get<{ status: AnimeStatus } | null>(
      `${this.statusUrl}?user_id=${userId}&anime_id=${animeId}`
    );
  }

  // Guardar o actualizar estado
  setEstado(userId: number, animeId: number, status: AnimeStatus) {
    const body = new FormData();
    body.append('user_id', String(userId));
    body.append('anime_id', String(animeId));
    body.append('status', status);

    return this.http.post(this.statusUrl, body, { responseType: 'json' });
  }

  // Obtener animes por estado (para deseados, vistos, procesos)
  getAnimesByStatus(userId: number, status: AnimeStatus): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.statusUrl}?user_id=${userId}&status=${status}`
    );
  }
}
