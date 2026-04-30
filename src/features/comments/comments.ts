// Componente de comentarios - lista y formulario de comentarios
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommentsService } from '../../core/services/comments';
import { Comment } from '../../core/models/comment.model';
import { Observable, of, ReplaySubject } from 'rxjs';
import { switchMap, tap, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comments.html',
  styleUrl: './comments.css'
})
export class CommentsComponent implements OnChanges {

  // Inputs que recibe el componente desde el anime-card
  @Input() animeId = 0;
  @Input() isLoggedIn = false;
  @Input() currentUserId = 0;
  @Input() animeTitle = '';
  @Input() animeImage = '';
  @Input() animeDescription = '';

  // avisar al componente cuando se añade un comentario
  @Output() commentAdded = new EventEmitter<void>();

  // Datos del formulario de comentarios
  commentText = '';
  rating = 5;
  isSubmitting = false;

  // Trigger para refrescar comentarios
  private refreshTrigger = new ReplaySubject<void>(1);

  // Lista de comentarios en modo observable
  comments$: Observable<Comment[]> = of([]);

  constructor(private commentsService: CommentsService) {

    // Escucha cambios globales de comentarios
    this.commentsService.refreshTrigger.subscribe(() => {
      this.refreshComments();
    });
  }

  ngOnChanges(changes: SimpleChanges) {

    // Logs para ver qué cambia 
    if (changes['animeId']) {
      console.log('animeId cambió a:', this.animeId);
    }

    if (changes['currentUserId']) {
      console.log('userId cambió a:', this.currentUserId);
    }

    if (changes['isLoggedIn']) {
      console.log('isLoggedIn cambió a:', this.isLoggedIn);
    }

    // Cuando cambia el anime, prepara todo otra vez
    if (changes['animeId'] && this.animeId > 0) {
      console.log('Nuevo anime cargado en comments');
      this.saveAnime();
      this.setupCommentsObservable();
    }

    // Si cambia el título, también lo guarda
    if (changes['animeTitle'] && this.animeId) {
      this.saveAnime();
    }
  }

  setupCommentsObservable() {
    console.log('Configurando comentarios para anime:', this.animeId);

    // Crea el flujo de comentarios
    this.comments$ = this.refreshTrigger.pipe(
      switchMap(() => {
        console.log('Cargando comentarios...');
        return this.commentsService.getComments(this.animeId);
      }),
      tap(comments => {
        // Logs para ver qué llega del backend
        console.log('Comentarios recibidos:', comments);
      }),
      shareReplay(1)
    );

    // Primera carga
    this.refreshTrigger.next();
  }

  refreshComments() {
    // Fuerza recarga de comentarios
    console.log('Refrescando comentarios...');
    this.refreshTrigger.next();
  }

  saveAnime() {
    // Guarda el anime en la base de datos si no existe
    if (!this.animeId || !this.animeTitle) return;

    this.commentsService.saveAnime({
      api_id: this.animeId,
      title: this.animeTitle,
      image: this.animeImage || undefined,
      description: this.animeDescription || undefined
    }).subscribe({
      next: () => {},
      error: () => {}
    });
  }

  addComment() {

    // Validaciones básicas
    if (!this.commentText.trim()) return;

    if (!this.isLoggedIn) {
      console.warn('No estás logueado');
      return;
    }

    if (this.currentUserId <= 0) {
      console.warn('Usuario inválido');
      return;
    }

    this.isSubmitting = true;

    // Limita el texto del comentario
    const cleanText = this.commentText.trim().substring(0, 300);

    // Estructura del comentario
    const newComment: Comment = {
      anime_id: this.animeId,
      user_id: this.currentUserId,
      content: cleanText,
      rating: this.rating
    };

    console.log('Enviando comentario:', newComment);

    // Envía el comentario al backend
    this.commentsService.addComment(newComment).subscribe({
      next: (response) => {
        console.log('Comentario añadido');

        // Resetea el formulario
        this.commentText = '';
        this.rating = 5;
        this.isSubmitting = false;

        // Recarga comentarios
        this.refreshComments();

        // Aviso al componente padre
        this.commentAdded.emit();
      },
      error: (err) => {
        console.error('Error al añadir comentario:', err);
        this.isSubmitting = false;
      }
    });
  }

  deleteComment(commentId: number) {

    // Borra comentario
    this.commentsService.deleteComment(commentId, this.currentUserId).subscribe({
      next: () => {
        // Recarga lista
        this.refreshComments();

        // Aviso al padre para actualizar stats
        this.commentAdded.emit();
      },
      error: (err) => {
        console.error('Error al borrar comentario:', err);
      }
    });
  }
}