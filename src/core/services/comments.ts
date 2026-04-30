// Servicio para gestionar comentarios
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Comment } from '../models/comment.model';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  // URL del endpoint de comentarios
  private apiUrl = 'http://localhost/ProyectoAnime/backend-php/api/comments.php';

  // BehaviorSubject para notificar cambios globales
  private refresh$ = new BehaviorSubject<void>(undefined);

  constructor(private http: HttpClient) {}

  // Obtener observable para escuchar cambios
  get refreshTrigger() {
    return this.refresh$.asObservable();
  }

  // Metodo para lanzar evento de actualizacion
  triggerRefresh() {
    this.refresh$.next();
  }

  // Obtener comentarios de un anime
  getComments(animeId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}?animeId=${animeId}`);
  }

  // Agregar nuevo comentario
  addComment(comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(this.apiUrl, comment).pipe(
      tap(() => this.triggerRefresh()) 
    );
  }

  // Eliminar comentario
  deleteComment(commentId: number, userId: number) {
    return this.http.delete(`${this.apiUrl}?id=${commentId}&userId=${userId}`).pipe(
      tap(() => this.triggerRefresh()) 
    );
  }

  // Guardar anime en la base de datos
  saveAnime(anime: { api_id: number; title: string; image?: string; description?: string }): Observable<any> {
    return this.http.post<any>('http://localhost/ProyectoAnime/backend-php/api/anime.php', anime);
  }

  // Obtener valoracion promedio de un anime
  getAverageRating(animeId: number): Observable<{ avg_rating: number }> {
    return this.http.get<{ avg_rating: number }>(`${this.apiUrl}?average=1&animeId=${animeId}`);
  }
}
