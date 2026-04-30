// Servicio para gestionar los animes
import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Anime } from '../models/anime.model';

@Injectable({ providedIn: 'root' })
export class AnimeService {

  // URLs de los endpoints
  private apiUrl = 'https://api.jikan.moe/v4/anime';
  private backendUrl = 'http://localhost/ProyectoAnime/backend-php/api/anime.php';
  private commentsUrl = 'http://localhost/ProyectoAnime/backend-php/api/comments.php';

  // Signal para almacenar la lista de animes
  private animes = signal<Anime[]>([]);
  getAnimes = this.animes.asReadonly();

  // Signal para el termino de busqueda
  private searchTerm = signal<string>('');
  setSearchTerm(term: string) {
    this.searchTerm.set(term);
  }

  // Signal para la opcion de ordenamiento
  private sortOption = signal<'rating' | 'az'>('rating');
  setSortOption(option: 'rating' | 'az') {
    this.sortOption.set(option);
  }

  // Computed para filtrar y ordenar animes
  filteredAnimes = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    let list = this.animes();

    // Filtrar por termino de busqueda
    if (term) {
      list = list.filter(anime =>
        anime.title.toLowerCase().includes(term)
      );
    }

    const sort = this.sortOption();

    // Ordenar por rating (mayor a menor)
    if (sort === 'rating') {
      return [...list].sort((a, b) => b.rating - a.rating);
    }

    // Ordenar alfabeticamente
    if (sort === 'az') {
      return [...list].sort((a, b) => a.title.localeCompare(b.title));
    }

    return list;
  });

  constructor(private http: HttpClient) {
    this.loadAnimes();
  }


  // CARGAR ANIMES DESDE LA BASE DE DATOS LOCAL

  loadAnimes() {
    this.http.get<any[]>(this.backendUrl).subscribe(data => {
      this.setMappedAnimes(data);

      // Cargar ratings reales
      const mapped = this.animes();
      mapped.forEach((anime, index) => {
        this.getAnimeAverage(anime.id).subscribe(avg => {
          mapped[index].rating = avg?.avg_rating ?? 0;
          this.animes.set([...mapped]);
        });
      });

    });
  }


  // MAPEO DE DATOS DESDE LA BASE DE DATOS

  private setMappedAnimes(data: any[]) {
    const mapped: Anime[] = data.map((a: any) => ({
      id: a.id,              // ID interno de la BD
      api_id: a.api_id,      // ID externo (mal_id)
      title: a.title,
      image: a.image,
      rating: a.avg_rating ?? 0,
      description: a.description,
      episodes: a.episodes ?? 0,
      isAiring: false
    }));

    this.animes.set(mapped);
  }

  // OBTENER MEDIA DE VALORACIONES DE UN ANIME

  getAnimeAverage(animeId: number) {
    return this.http.get<any>(`${this.commentsUrl}?average=1&animeId=${animeId}`);
  }

  // GUARDAR VALORACION DE UN ANIME

  saveRating(animeId: number, rating: number, userId: number) {
    return this.http.post<any>(this.commentsUrl, {
      anime_id: animeId,
      user_id: userId,
      content: "",
      rating: rating
    });
  }
}
