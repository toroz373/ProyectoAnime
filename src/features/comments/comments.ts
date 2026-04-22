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

  @Input() animeId = 0;
  @Input() isLoggedIn = false;
  @Input() currentUserId = 0;
  @Input() animeTitle = '';
  @Input() animeImage = '';
  @Input() animeDescription = '';
  @Output() commentAdded = new EventEmitter<void>();

  commentText = '';
  rating = 5;
  isSubmitting = false;

  private refreshTrigger = new ReplaySubject<void>(1);
  comments$: Observable<Comment[]> = of([]);

  constructor(private commentsService: CommentsService) {
    // 🔥 escuchar cambios globales
    this.commentsService.refreshTrigger.subscribe(() => {
      this.refreshComments();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['animeId']) {
      console.log('CommentsComponent - animeId changed to:', this.animeId);
    }
    if (changes['currentUserId']) {
      console.log('CommentsComponent - currentUserId changed to:', this.currentUserId);
    }
    if (changes['isLoggedIn']) {
      console.log('CommentsComponent - isLoggedIn changed to:', this.isLoggedIn);
    }
    
    if (changes['animeId'] && this.animeId > 0) {
      console.log('CommentsComponent - Setting up for new anime');
      this.saveAnime();
      this.setupCommentsObservable();
    }
    if (changes['animeTitle'] && this.animeId) {
      this.saveAnime();
    }
  }

  setupCommentsObservable() {
    console.log('setupCommentsObservable called for animeId:', this.animeId);
    this.comments$ = this.refreshTrigger.pipe(
      switchMap(() => {
        console.log('Fetching comments for animeId:', this.animeId);
        return this.commentsService.getComments(this.animeId);
      }),
      tap(comments => {
        console.log('Comments received in component:', comments);
        console.log('Raw JSON:', JSON.stringify(comments, null, 2));
        if (comments && comments.length > 0) {
          console.log('First comment:', comments[0]);
          console.log('First comment keys:', Object.keys(comments[0]));
        }
      }),
      shareReplay(1)
    );
    // Trigger initial load
    console.log('Triggering initial load');
    this.refreshTrigger.next();
  }

  refreshComments() {
    console.log('refreshComments: triggering refresh for animeId:', this.animeId);
    this.refreshTrigger.next();
  }

  saveAnime() {
    if (!this.animeId || !this.animeTitle) {
      return;
    }

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
    if (!this.commentText.trim()) return;
    if (!this.isLoggedIn) {
      console.warn('User not logged in');
      return;
    }
    if (this.currentUserId <= 0) {
      console.warn('Invalid currentUserId:', this.currentUserId);
      return;
    }

    this.isSubmitting = true;

    // 🔒 normaliza una sola vez
    const cleanText = this.commentText.trim().substring(0, 300);

    const newComment: Comment = {
      anime_id: this.animeId,
      user_id: this.currentUserId,
      content: cleanText,
      rating: this.rating
    };

    console.log('Adding comment:', newComment);

    this.commentsService.addComment(newComment).subscribe({
      next: (response) => {
        console.log('Comment added successfully:', response);
        this.commentText = '';
        this.rating = 5;
        this.isSubmitting = false;
        this.refreshComments();
        this.commentAdded.emit();
      },
      error: (err) => {
        console.error('Error adding comment:', err);
        this.isSubmitting = false;
      }
    });
  }

  deleteComment(commentId: number) {
    this.commentsService.deleteComment(commentId, this.currentUserId).subscribe({
      next: () => {
        this.refreshComments();
        this.commentAdded.emit(); // 🔥 actualiza stats arriba
      },
      error: (err) => {
        console.error('Error deleting comment:', err);
      }
    });
  }
}
