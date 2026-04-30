import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';
import { AnimeStatus } from '../../core/services/anime-list';

@Injectable({ providedIn: 'root' })
export class EstadoService {

  private http = inject(HttpClient);

  private statusUrl = 'http://localhost/ProyectoAnime/backend-php/api/estado.php';

  // Subject privado
  private refreshSubject = new Subject<void>();

  // Observable público 
  refreshTrigger$ = this.refreshSubject.asObservable();

  // lanzar evento
  triggerRefresh() {
    this.refreshSubject.next();
  }

  getEstado(userId: number, animeId: number): Observable<{ status: AnimeStatus } | null> {
    return this.http.get<{ status: AnimeStatus } | null>(
      `${this.statusUrl}?user_id=${userId}&anime_id=${animeId}`
    );
  }

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

  getAnimesByStatus(userId: number, status: AnimeStatus): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.statusUrl}?user_id=${userId}&status=${status}`
    );
  }

  updateEstado(userId: number, animeId: number, status: AnimeStatus): Observable<any> {
    return this.http.post(this.statusUrl, {
      user_id: userId,
      anime_id: animeId,
      status
    }).pipe(
      tap(() => this.triggerRefresh()) 
    );
  }

  // eliminar anime
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
