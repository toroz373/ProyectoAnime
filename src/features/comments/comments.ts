import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommentsService } from '../../core/services/comments';
import { Comment } from '../../core/models/comment.model';
import { signal } from '@angular/core';

// Componente de comentarios - muestra lista de comentarios y permite agregar nuevos
@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comments.html',
  styleUrl: './comments.css'
})
export class CommentsComponent {
  // ID del anime cuyos comentarios se muestran
  @Input() animeId!: number;
  
  // Indica si el usuario está logueado (para mostrar/ocultar formulario)
  @Input() isLoggedIn = false;
  
  // Nombre del usuario logueado
  @Input() currentUserName = '';

  // State: texto del comentario que escribe el usuario
  commentText = signal('');
  
  // State: valoración seleccionada para el comentario
  rating = signal(5);
  
  // State: indica si está enviando el comentario
  isSubmitting = signal(false);

  constructor(private commentsService: CommentsService) {}

  // Obtener lista de comentarios del anime (en tiempo real)
  get comments() {
    return this.commentsService.getComments(this.animeId);
  }

  // Agregar un nuevo comentario
  addComment() {
    // Validar que haya texto y que esté logueado
    if (!this.commentText().trim() || !this.isLoggedIn) {
      return;
    }

    this.isSubmitting.set(true);
    
    // Crear objeto del nuevo comentario
    const newComment: Comment = {
      id: Date.now(),
      animeId: this.animeId,
      user: this.currentUserName,
      text: this.commentText().trim(),
      rating: this.rating()
    };

    // Enviar el comentario al servicio
    this.commentsService.addComment(this.animeId, newComment).subscribe({
      next: () => {
        // Si fue exitoso: limpiar formulario
        this.commentText.set('');
        this.rating.set(5);
        this.isSubmitting.set(false);
      },
      error: (err) => {
        console.error('Error al añadir comentario:', err);
        this.isSubmitting.set(false);
      }
    });
  }
}
