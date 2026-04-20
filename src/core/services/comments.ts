import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, shareReplay } from 'rxjs/operators';
import { Comment } from '../models/comment.model';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  private apiUrl = 'http://localhost/ProyectoAnime/backend-php/api/comments.php';

  constructor(private http: HttpClient) {}

  getComments(animeId: number): Observable<Comment[]> {
    console.log('getComments called with animeId:', animeId);
    if (!animeId || animeId === 0) {
      console.warn('getComments: Invalid animeId:', animeId);
    }
    return this.http.get<Comment[]>(`${this.apiUrl}?animeId=${animeId}`).pipe(
      tap(comments => console.log('getComments: received data:', comments))
    );
  }

  addComment(comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(this.apiUrl, comment);
  }

  saveAnime(anime: { api_id: number; title: string; image?: string; description?: string }): Observable<any> {
    return this.http.post<any>('http://localhost/ProyectoAnime/backend-php/api/anime.php', anime);
  }

  getAverageRating(animeId: number): Observable<{ avg_rating: number }> {
    return this.http.get<{ avg_rating: number }>(`${this.apiUrl}?average=1&animeId=${animeId}`);
  }
}
