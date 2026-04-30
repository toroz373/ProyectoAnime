// Servicio para gestionar la lista personal de animes del usuario
import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// Tipos de estado de animes (DEBEN COINCIDIR CON EL BACKEND)
export type AnimeStatus = 'visto' | 'deseado' | 'en_proceso';

// Interfaz para el estado de un anime en la lista
interface AnimeListItem {
  animeId: number;
  status: AnimeStatus;
}

@Injectable({ providedIn: 'root' })
export class AnimeListService {
  // Detectar si estamos en navegador
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  // Signal para almacenar la lista de animes del usuario
  private userAnimeList = signal<AnimeListItem[]>([]);

  constructor() {
    this.loadAnimeList();
  }

  // Obtener el estado de un anime especifico
  getAnimeStatus(animeId: number): AnimeStatus | null {
    const item = this.userAnimeList().find(a => a.animeId === animeId);
    return item?.status || null;
  }

  // Establecer el estado de un anime
  setAnimeStatus(animeId: number, status: AnimeStatus) {
    const list = [...this.userAnimeList()];
    const index = list.findIndex(a => a.animeId === animeId);

    // Si existe, actualizar; si no, agregar
    if (index !== -1) {
      list[index].status = status;
    } else {
      list.push({ animeId, status });
    }

    this.userAnimeList.set(list);
    this.saveAnimeList();
  }

  // Obtener todos los animes de un estado especifico
  getAnimesByStatus(status: AnimeStatus) {
    return this.userAnimeList().filter(a => a.status === status);
  }

  // Obtener la lista completa
  getFullList() {
    return this.userAnimeList;
  }

  // Cargar lista desde localStorage
  private loadAnimeList() {
    if (!this.isBrowser) return;

    const saved = localStorage.getItem('animeList');
    if (saved) {
      this.userAnimeList.set(JSON.parse(saved));
    }
  }

  // Guardar lista en localStorage
  private saveAnimeList() {
    if (!this.isBrowser) return;

    localStorage.setItem('animeList', JSON.stringify(this.userAnimeList()));
  }
}
