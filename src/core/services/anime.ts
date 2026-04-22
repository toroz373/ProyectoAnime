import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Anime } from '../models/anime.model';
import { catchError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AnimeService {

  private apiUrl = 'https://api.jikan.moe/v4/anime';
  private backendUrl = 'http://localhost/ProyectoAnime/backend-php/api/anime.php';
  private commentsUrl = 'http://localhost/ProyectoAnime/backend-php/api/comments.php';

  private animes = signal<Anime[]>([]);
  getAnimes = this.animes.asReadonly();

  private searchTerm = signal<string>('');
  setSearchTerm(term: string) {
    this.searchTerm.set(term);
  }

  filteredAnimes = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.animes();
    return this.animes().filter(anime =>
      anime.title.toLowerCase().includes(term)
    );
  });

  constructor(private http: HttpClient) {
    this.loadAnimes();
  }

  loadAnimes() {
    this.http.get<any>(this.backendUrl).pipe(
      catchError(() => [])
    ).subscribe(dbResponse => {

      if (Array.isArray(dbResponse) && dbResponse.length > 0) {
        this.setMappedAnimes(dbResponse);
        return;
      }

      this.http.get<any>(this.apiUrl).pipe(
        catchError(() => [])
      ).subscribe(apiResponse => {

        if (!apiResponse.data) return;

        const apiData = apiResponse.data;

        apiData.forEach((anime: any) => {
          this.http.post(this.backendUrl, {
            api_id: anime.mal_id,
            title: anime.title,
            image: anime.images.jpg.image_url,
            description: anime.synopsis
          }).subscribe();
        });

        this.setMappedAnimes(apiData);
      });
    });
  }

  private setMappedAnimes(data: any[]) {
  const mapped: Anime[] = data.map((a: any) => ({
    id: a.id,                     // ID REAL de la BD
    api_id: a.api_id ?? a.mal_id, // ID de la API externa
    title: a.title,
    image: a.images?.jpg?.image_url ?? a.image,
    rating: a.avg_rating ?? 0,
    description: a.synopsis ?? a.description,
    episodes: a.episodes ?? 0,
    isAiring: a.status ? a.status === 'Currently Airing' : false
  }));

  this.animes.set(mapped);
}


  getAnimeAverage(animeId: number) {
    return this.http.get<any>(`${this.commentsUrl}?average=1&animeId=${animeId}`);
  }

  saveRating(animeId: number, rating: number, userId: number) {
    return this.http.post<any>(this.commentsUrl, {
      anime_id: animeId,
      user_id: userId,
      content: "",
      rating: rating
    });
  }
}
