import { Injectable, signal } from '@angular/core';
import { Anime } from '../models/anime.model';

// Servicio de animes - contiene la lista de animes disponibles
@Injectable({ providedIn: 'root' })
export class AnimeService {
  // List de animes con datos de prueba
  private animes = signal<Anime[]>([
    { 
      id: 1, 
      title: 'Naruto', 
      image: 'Naruto.jfif', 
      rating: 4.5,
      description: 'La historia de un ninja joven que busca reconocimiento y sueña con convertirse en Hokage.',
      episodes: 220,
      isAiring: false
    },
    { 
      id: 2, 
      title: 'One Piece', 
      image: 'One Piece.jfif', 
      rating: 4.8,
      description: 'La aventura de Luffy y su tripulación en busca del tesoro legendario One Piece.',
      episodes: 1100,
      isAiring: true
    },
    { 
      id: 3, 
      title: 'Frieren', 
      image: 'Frieren.jpg', 
      rating: 4.9,
      description: 'El viaje de un grupo de aventureros para construir un mundo donde los humanos y los demonios puedan convivir.',
      episodes: 28,
      isAiring: false
    },
    { 
      id: 4, 
      title: 'Vinland Saga', 
      image: 'Vinland Saga.png', 
      rating: 4.7,
      description: 'La historia de un guerrero vikingo que busca venganza en la tierra de Vinland.',
      episodes: 50,
      isAiring: false
    }
  ]);

  // Devolver la lista de animes (solo lectura para que no se modifique directamente)
  getAnimes = this.animes.asReadonly();
}
