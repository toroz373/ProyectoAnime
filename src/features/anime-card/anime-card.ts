import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Anime } from '../../core/models/anime.model';
import { CommentsComponent } from '../comments/comments';
import { CommentsService } from '../../core/services/comments';
import { AnimeListService, AnimeStatus } from '../../core/services/anime-list';

// Componente de tarjeta del anime - muestra imagen, título, valoración y comentarios
@Component({
  selector: 'app-anime-card',
  standalone: true,
  imports: [CommonModule, CommentsComponent],
  templateUrl: './anime-card.html',
  styleUrl: './anime-card.css'
})
export class AnimeCardComponent implements OnInit {
  // Datos del anime a mostrar
  @Input() anime!: Anime;
  
  // Indica si el usuario está logueado (permite comentar y valorar)
  @Input() isLoggedIn = false;
  
  // Nombre del usuario logueado
  @Input() currentUserName = '';

  // Indica si mostrar los botones de estado (solo en private feed)
  @Input() showStatusButtons = false;

  // State: mostrar u ocultar los comentarios
  showComments = signal(false);
  
  // State: cantidad de comentarios del anime
  commentsCount = 0;
  
  // State: valoración que el usuario ha puesto (0 si no ha valorado)
  userRating = signal(0);

  // State: estado actual del anime (para_ver, viendo, visto)
  currentStatus = signal<AnimeStatus | null>(null);

  // State: mostrar u ocultar el menú de tres puntos
  showMenu = signal(false);

  private commentsService = inject(CommentsService);
  private animeListService = inject(AnimeListService);

  // Al iniciar: obtener cantidad de comentarios del anime
  ngOnInit() {
    this.commentsService.getComments(this.anime.id).subscribe(comments => {
      this.commentsCount = comments.length;
    });

    // Cargar el estado del anime si es necesario
    if (this.showStatusButtons) {
      this.currentStatus.set(this.animeListService.getAnimeStatus(this.anime.id));
    }
  }

  // Alternar mostrar/ocultar comentarios
  toggleComments() {
    this.showComments.update(val => !val);
  }

  // Alternar mostrar/ocultar el menú de tres puntos
  toggleMenu() {
    this.showMenu.update(val => !val);
  }

  // Cerrar el menú de tres puntos
  closeMenu() {
    this.showMenu.set(false);
  }

  // Establecer la valoración del usuario (solo si está logueado)
  setRating(stars: number) {
    if (this.isLoggedIn) {
      this.userRating.set(stars);
    }
  }

  // Cambiar el estado del anime en la lista del usuario y cerrar menú
  setStatus(status: AnimeStatus) {
    this.animeListService.setAnimeStatus(this.anime.id, status);
    this.currentStatus.set(status);
    this.closeMenu();
  }
}
