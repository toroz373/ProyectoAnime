import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// Tipos de estado de animes (DEBEN COINCIDIR CON EL BACKEND)
export type AnimeStatus = 'visto' | 'deseado' | 'en_proceso';

// Interfaz para el estado de un anime
interface AnimeListItem {
  animeId: number;
  status: AnimeStatus;
}

@Injectable({ providedIn: 'root' })
export class AnimeListService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  private userAnimeList = signal<AnimeListItem[]>([]);

  constructor() {
    this.loadAnimeList();
  }

  getAnimeStatus(animeId: number): AnimeStatus | null {
    const item = this.userAnimeList().find(a => a.animeId === animeId);
    return item?.status || null;
  }

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

  getAnimesByStatus(status: AnimeStatus) {
    return this.userAnimeList().filter(a => a.status === status);
  }

  getFullList() {
    return this.userAnimeList;
  }

  private loadAnimeList() {
    if (!this.isBrowser) return;

    const saved = localStorage.getItem('animeList');
    if (saved) {
      this.userAnimeList.set(JSON.parse(saved));
    }
  }

  private saveAnimeList() {
    if (!this.isBrowser) return;

    localStorage.setItem('animeList', JSON.stringify(this.userAnimeList()));
  }
}
