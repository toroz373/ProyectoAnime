import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// Tipos de estado de animes
export type AnimeStatus = 'para_ver' | 'viendo' | 'visto';

// Interfaz para el estado de un anime
interface AnimeListItem {
  animeId: number;
  status: AnimeStatus;
}

// Servicio para gestionar la lista de animes del usuario (Para ver, Viendo, Visto)
@Injectable({ providedIn: 'root' })
export class AnimeListService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  // State: lista de animes del usuario con su estado
  private userAnimeList = signal<AnimeListItem[]>([]);

  constructor() {
    this.loadAnimeList();
  }

  // Obtener el estado de un anime específico
  getAnimeStatus(animeId: number): AnimeStatus | null {
    const item = this.userAnimeList().find(a => a.animeId === animeId);
    return item?.status || null;
  }

  // Cambiar el estado de un anime
  setAnimeStatus(animeId: number, status: AnimeStatus) {
    const list = [...this.userAnimeList()];
    const index = list.findIndex(a => a.animeId === animeId);

    if (index !== -1) {
      list[index].status = status;
    } else {
      list.push({ animeId, status });
    }

    this.userAnimeList.set(list);
    this.saveAnimeList();
  }

  // Obtener todos los animes en un estado específico
  getAnimesByStatus(status: AnimeStatus) {
    return this.userAnimeList().filter(a => a.status === status);
  }

  // Obtener la lista completa de animes del usuario
  getFullList() {
    return this.userAnimeList;
  }

  // Cargar la lista desde localStorage
  private loadAnimeList() {
    if (!this.isBrowser) {
      return;
    }

    const saved = localStorage.getItem('animeList');
    if (saved) {
      this.userAnimeList.set(JSON.parse(saved));
    }
  }

  // Guardar la lista en localStorage
  private saveAnimeList() {
    if (!this.isBrowser) {
      return;
    }

    localStorage.setItem('animeList', JSON.stringify(this.userAnimeList()));
  }
}
