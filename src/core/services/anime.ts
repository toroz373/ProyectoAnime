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

  private sortOption = signal<'rating' | 'az'>('rating');
  setSortOption(option: 'rating' | 'az') {
    this.sortOption.set(option);
  }

  filteredAnimes = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    let list = this.animes();

    if (term) {
      list = list.filter(anime =>
        anime.title.toLowerCase().includes(term)
      );
    }

    const sort = this.sortOption();

    if (sort === 'rating') {
      return [...list].sort((a, b) => b.rating - a.rating);
    }

    if (sort === 'az') {
      return [...list].sort((a, b) => a.title.localeCompare(b.title));
    }

    return list;
  });

  constructor(private http: HttpClient) {
    this.loadAnimes();
  }

  // ============================================================
  // CARGAR ANIMES DESDE TU BASE DE DATOS (NO DESDE JIKAN)
  // ============================================================
  loadAnimes() {
    this.http.get<any[]>(this.backendUrl).subscribe(data => {
      this.setMappedAnimes(data);

      // Cargar medias reales
      const mapped = this.animes();
      mapped.forEach((anime, index) => {
        this.getAnimeAverage(anime.id).subscribe(avg => {
          mapped[index].rating = avg?.avg_rating ?? 0;
          this.animes.set([...mapped]);
        });
      });
    });
  }

  // ============================================================
  // MAPEO CORRECTO USANDO ID INTERNO + API_ID
  // ============================================================
  private setMappedAnimes(data: any[]) {
    const mapped: Anime[] = data.map((a: any) => ({
      id: a.id,              // ✔ ID interno de tu BD
      api_id: a.api_id,      // ✔ ID externo (mal_id)
      title: a.title,
      image: a.image,
      rating: a.avg_rating ?? 0,
      description: a.description,
      episodes: a.episodes ?? 0,
      isAiring: false        // si quieres, puedes guardar esto también en BD
    }));

    this.animes.set(mapped);
  }

  // ============================================================
  // RATING Y COMENTARIOS USAN EL ID INTERNO
  // ============================================================
  getAnimeAverage(animeId: number) {
    return this.http.get<any>(`${this.commentsUrl}?average=1&animeId=${animeId}`);
  }

  saveRating(animeId: number, rating: number, userId: number) {
    return this.http.post<any>(this.commentsUrl, {
      anime_id: animeId,   // ✔ ID interno
      user_id: userId,
      content: "",
      rating: rating
    });
  }
}
