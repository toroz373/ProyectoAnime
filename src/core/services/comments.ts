import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Comment } from '../models/comment.model';

// Servicio de comentarios - maneja la obtención y creación de comentarios
@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  private apiUrl = '/api/comments';

  // Datos de prueba: simulamos comentarios para cada anime
  private mockComments: { [key: number]: Comment[] } = {
    1: [
      { id: 1, animeId: 1, user: 'Juan', text: '¡Naruto es increíble! La mejor serie que he visto.', rating: 5 },
      { id: 2, animeId: 1, user: 'María', text: 'Buen anime, aunque algo largo.', rating: 4 },
    ],
    2: [
      { id: 3, animeId: 2, user: 'Carlos', text: 'One Piece es una obra maestra.', rating: 5 },
    ],
    3: [
      { id: 4, animeId: 3, user: 'Ana', text: 'Frieren es una joya, la historia es hermosa.', rating: 5 },
    ],
    4: [
      { id: 5, animeId: 4, user: 'Roberto', text: 'Vinland Saga tiene unos personajes increíbles.', rating: 5 },
    ]
  };

  // BehaviorSubject para que los comentarios se actualicen en tiempo real
  private commentsSubject = new BehaviorSubject<{ [key: number]: Comment[] }>(this.mockComments);

  constructor(private http: HttpClient) {}

  // Obtener los comentarios de un anime específico
  getComments(animeId: number): Observable<Comment[]> {
    return this.commentsSubject.asObservable().pipe(
      map(comments => comments[animeId] || [])
    );
  }

  // Añadir un nuevo comentario
  addComment(animeId: number, comment: Comment): Observable<Comment> {
    // Si no existen comentarios para este anime, crear el array
    if (!this.mockComments[animeId]) {
      this.mockComments[animeId] = [];
    }
    
    // Agregar el nuevo comentario a la lista
    this.mockComments[animeId].push(comment);
    
    // Notificar a todos los subscribers que los comentarios cambiaron
    this.commentsSubject.next({ ...this.mockComments });
    
    // Retornar el comentario agregado
    return of(comment);
    
    // Cuando haya backend:
    // return this.http.post<Comment>(`${this.apiUrl}/${animeId}`, comment);
  }
}
