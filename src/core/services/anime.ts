import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Anime } from '../models/anime.model';

@Injectable({ providedIn: 'root' })
export class AnimeService {

  private apiUrl = 'https://api.jikan.moe/v4/anime';

  private averageUrl = 'https://localhost/miruzone/backend-php/api/get_average.php';
  private saveRatingUrl = 'https://localhost/miruzone/backend-php/api/save_rating.php';

  private animes = signal<Anime[]>([]);
  getAnimes = this.animes.asReadonly();

  constructor(private http: HttpClient) {
    this.loadAnimes();
  }

  loadAnimes() {
    this.http.get<any>(this.apiUrl).subscribe(response => {

      const mapped: Anime[] = response.data.map((a: any) => ({
        id: a.mal_id,
        title: a.title,
        image: a.images.jpg.image_url,
        rating: 0, // media real vendrá de tu BD
        description: a.synopsis,
        episodes: a.episodes,
        isAiring: a.status === 'Currently Airing'
      }));

      this.animes.set(mapped);

      // Cargar medias reales
      mapped.forEach((anime, index) => {
        this.getAnimeAverage(anime.id).subscribe(avg => {
          mapped[index].rating = avg.average;
          this.animes.set([...mapped]);
        });
      });
    });
  }

  getAnimeAverage(animeId: number) {
    return this.http.get<any>(`${this.averageUrl}?animeId=${animeId}`);
  }

  saveRating(animeId: number, rating: number, user: string) {
    return this.http.post<any>(this.saveRatingUrl, {
      animeId,
      rating,
      user
    });
  }
}
