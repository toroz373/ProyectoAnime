import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Anime } from '../models/anime.model';

@Injectable({ providedIn: 'root' })
export class AnimeService {

  private apiUrl = 'https://api.jikan.moe/v4/anime';
  private commentsUrl = 'http://localhost/ProyectoAnime/backend-php/api/comments.php';

  private animes = signal<Anime[]>([]);
  getAnimes = this.animes.asReadonly();

  private searchTerm = signal<string>('');
  setSearchTerm(term: string) {
    this.searchTerm.set(term);
  }

  // 🔹 NUEVO: opción de ordenación
  private sortOption = signal<'rating' | 'az'>('rating');

  setSortOption(option: 'rating' | 'az') {
    this.sortOption.set(option);
  }

  // 🔹 MODIFICADO: ahora también ordena
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

      // Cargar medias reales SIN ordenar aquí
      // Cargar medias reales SIN ordenar aquí
      mapped.forEach((anime, index) => {
      this.getAnimeAverage(anime.id).subscribe(avg => {
      mapped[index].rating = avg?.avg_rating ?? 0;
      this.animes.set([...mapped]); // 👈 solo refresca
      });
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
