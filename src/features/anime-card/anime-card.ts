import { Component, Input, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Anime } from '../../core/models/anime.model';
import { CommentsComponent } from '../comments/comments';
import { CommentsService } from '../../core/services/comments';
import { AnimeListService, AnimeStatus } from '../../core/services/anime-list';
import { EstadoService } from '../../core/services/estado.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-anime-card',
  standalone: true,
  imports: [CommonModule, CommentsComponent],
  templateUrl: './anime-card.html',
  styleUrl: './anime-card.css'
})
export class AnimeCardComponent implements OnInit, OnDestroy {

  @Input() anime!: Anime;
  @Input() isLoggedIn = false;
  @Input() currentUserName = '';
  @Input() currentUserId = 0;
  @Input() showStatusButtons = false;

  showComments = signal(false);
  commentsCount = signal(0);
  averageRating = signal(0);
  currentStatus = signal<AnimeStatus | null>(null);

  showMenu = signal(false);
  isExpanded = signal(false);

  private commentsService = inject(CommentsService);
  private estadoService = inject(EstadoService);
  private animeListService = inject(AnimeListService);

  private sub?: Subscription;

  ngOnInit() {
    this.sub = this.commentsService.refreshTrigger.subscribe(() => {
      this.refreshStats();
    });

    setTimeout(() => this.refreshStats(), 0);

    if (this.showStatusButtons) {
      this.currentStatus.set(
        this.animeListService.getAnimeStatus(this.anime.id)
      );
    }
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  get averageStars() {
    return Math.round(this.averageRating());
  }

  refreshStats() {
    if (!this.anime?.id) return;

    this.commentsService.getComments(this.anime.id).subscribe(comments => {
      this.commentsCount.set(comments.length);
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

  // 🔥 AQUÍ SE ACTUALIZA EL ESTADO
  setStatus(status: AnimeStatus) {
    if (!this.currentUserId || !this.anime?.id) return;

    this.estadoService.setEstado(this.currentUserId, this.anime.id, status)
      .subscribe(() => {
        this.currentStatus.set(status);
        this.animeListService.setAnimeStatus(this.anime.id, status);
      });
  }
}
