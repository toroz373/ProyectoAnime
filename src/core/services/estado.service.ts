// Servicio para gestionar el estado de los animes (visto, deseado, en proceso)
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';
import { AnimeStatus } from '../../core/services/anime-list';

@Injectable({ providedIn: 'root' })
export class EstadoService {

  // Inyectar cliente HTTP
  private http = inject(HttpClient);

  // URL del endpoint de estados
  private statusUrl = 'http://localhost/ProyectoAnime/backend-php/api/estado.php';

  // Subject para notificar cambios
  private refreshSubject = new Subject<void>();

  // Observable público para escuchar cambios
  refreshTrigger$ = this.refreshSubject.asObservable();

  // Lanzar evento de actualizacion
  triggerRefresh() {
    this.refreshSubject.next();
  }

  // Obtener el estado de un anime para un usuario
  getEstado(userId: number, animeId: number): Observable<{ status: AnimeStatus } | null> {
    return this.http.get<{ status: AnimeStatus } | null>(
      `${this.statusUrl}?user_id=${userId}&anime_id=${animeId}`
    );
  }

  // Establecer el estado de un anime
  setEstado(userId: number, animeId: number, status: AnimeStatus) {
    const body = new FormData();
    body.append('user_id', String(userId));
    body.append('anime_id', String(animeId));
    body.append('status', status);

    return this.http.post(this.statusUrl, body, { responseType: 'json' })
      .pipe(
        tap(() => this.triggerRefresh()) 
      );
  }

  // Obtener todos los animes de un estado especifico
  getAnimesByStatus(userId: number, status: AnimeStatus): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.statusUrl}?user_id=${userId}&status=${status}`
    );
  }

  // Actualizar el estado de un anime
  updateEstado(userId: number, animeId: number, status: AnimeStatus): Observable<any> {
    return this.http.post(this.statusUrl, {
      user_id: userId,
      anime_id: animeId,
      status
    }).pipe(
      tap(() => this.triggerRefresh()) 
    );
  }

  // Eliminar el estado de un anime
  deleteEstado(userId: number, animeId: number) {
    const body = new FormData();
    body.append('user_id', String(userId));
    body.append('anime_id', String(animeId));
    body.append('action', 'delete');

    return this.http.post(this.statusUrl, body).pipe(
      tap(() => this.triggerRefresh()) 
    );
  }
}
