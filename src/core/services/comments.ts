import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Comment } from '../models/comment.model';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  private apiUrl = 'http://localhost/ProyectoAnime/backend-php/api/comments.php';

  // sistema reactivo global
  private refresh$ = new BehaviorSubject<void>(undefined);

  constructor(private http: HttpClient) {}

  // escuchar cambios
  get refreshTrigger() {
    return this.refresh$.asObservable();
  }

  // actualización global
  triggerRefresh() {
    this.refresh$.next();
  }

  getComments(animeId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}?animeId=${animeId}`);
  }

  addComment(comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(this.apiUrl, comment).pipe(
      tap(() => this.triggerRefresh()) 
    );
  }

  deleteComment(commentId: number, userId: number) {
    return this.http.delete(`${this.apiUrl}?id=${commentId}&userId=${userId}`).pipe(
      tap(() => this.triggerRefresh()) 
    );
  }

  saveAnime(anime: { api_id: number; title: string; image?: string; description?: string }): Observable<any> {
    return this.http.post<any>('http://localhost/ProyectoAnime/backend-php/api/anime.php', anime);
  }

  getAverageRating(animeId: number): Observable<{ avg_rating: number }> {
    return this.http.get<{ avg_rating: number }>(`${this.apiUrl}?average=1&animeId=${animeId}`);
  }
}
