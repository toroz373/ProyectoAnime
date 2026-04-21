import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Anime } from '../models/anime.model';

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
    this.http.get<any>(this.apiUrl).subscribe(response => {

      const mapped: Anime[] = response.data.map((a: any) => ({
        id: a.mal_id,
        title: a.title,
        image: a.images.jpg.image_url,
        rating: 0,
        description: a.synopsis,
        episodes: a.episodes,
        isAiring: a.status === 'Currently Airing'
      }));

      this.animes.set(mapped);

      // Guardar cada anime en la BD
      mapped.forEach(anime => {
        this.http.post(this.backendUrl, {
          api_id: anime.id,
          title: anime.title,
          image: anime.image,
          description: anime.description
        }).subscribe();
      });

      // Cargar medias reales
      mapped.forEach((anime, index) => {
        this.getAnimeAverage(anime.id).subscribe(avg => {
          mapped[index].rating = avg?.avg_rating ?? 0;
          this.animes.set(this.sortByRating(mapped));
        });
      });
    });
  }

  private sortByRating(animes: Anime[]) {
    return [...animes].sort((a, b) => b.rating - a.rating);
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

