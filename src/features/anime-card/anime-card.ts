import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Anime } from '../../core/models/anime.model';
import { CommentsComponent } from '../comments/comments';
import { CommentsService } from '../../core/services/comments';
import { EstadoService } from '../../core/services/estado.service';

export type AnimeStatus = 'deseado' | 'visto' | 'en_proceso';

@Component({
  selector: 'app-anime-card',
  standalone: true,
  imports: [CommonModule, CommentsComponent],
  templateUrl: './anime-card.html',
  styleUrl: './anime-card.css'
})
export class AnimeCardComponent implements OnInit {

  @Input() anime!: Anime;
  @Input() isLoggedIn = false;
  @Input() currentUserName = '';
  @Input() currentUserId = 0;
  @Input() showStatusButtons = false;

  showComments = signal(false);
  commentsCount = 0;

  averageRating = signal(0);
  currentStatus = signal<AnimeStatus | null>(null);

  get averageStars() {
    return Math.round(this.averageRating());
  }

  showMenu = signal(false);
  isExpanded = signal(false);

  private commentsService = inject(CommentsService);
  private estadoService = inject(EstadoService);

  ngOnInit() {
    this.refreshStats();

    if (this.showStatusButtons && this.isLoggedIn) {
      this.loadStatusFromBackend();
    }
  }

  loadStatusFromBackend() {
    if (!this.currentUserId || !this.anime?.id) return;

    this.estadoService.getEstado(this.currentUserId, this.anime.id)
      .subscribe(res => {
        if (res?.status) {
          this.currentStatus.set(res.status as AnimeStatus);
        }
      });
  }

  setStatus(status: AnimeStatus) {
    if (!this.isLoggedIn || !this.currentUserId || !this.anime?.id) return;

    this.estadoService.setEstado(this.currentUserId, this.anime.id, status)
      .subscribe(() => {
        this.currentStatus.set(status);
        this.showMenu.set(false);
      });
  }

  refreshStats() {
    if (!this.anime || !this.anime.id) return;

    this.commentsService.getComments(this.anime.id).subscribe(comments => {
      this.commentsCount = comments.length;
    });

    this.commentsService.getAverageRating(this.anime.id).subscribe(res => {
      this.averageRating.set(res?.avg_rating || 0);
    });
  }

  toggleComments() {
    this.showComments.update(v => !v);
  }

  toggleMenu() {
    this.showMenu.update(v => !v);
  }

  closeMenu() {
    this.showMenu.set(false);
  }

  toggleDescription() {
    this.isExpanded.update(v => !v);
  }
}
