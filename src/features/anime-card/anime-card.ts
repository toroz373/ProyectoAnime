import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Anime } from '../../core/models/anime.model';
import { CommentsComponent } from '../comments/comments';
import { CommentsService } from '../../core/services/comments';
import { AnimeListService, AnimeStatus } from '../../core/services/anime-list';

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

  // ⭐ Media real desde tu base de datos
  averageRating = signal(0);

  currentStatus = signal<AnimeStatus | null>(null);

  get averageStars() {
    return Math.round(this.averageRating());
  }
  showMenu = signal(false);
  isExpanded = signal(false);

  private commentsService = inject(CommentsService);
  private animeListService = inject(AnimeListService);

  ngOnInit() {
    console.log('AnimeCardComponent ngOnInit, anime:', this.anime);
    console.log('AnimeCardComponent - isLoggedIn:', this.isLoggedIn, 'currentUserId:', this.currentUserId, 'currentUserName:', this.currentUserName);
    this.refreshStats();

    // Estado del anime
    if (this.showStatusButtons) {
      this.currentStatus.set(this.animeListService.getAnimeStatus(this.anime.id));
    }
  }

  refreshStats() {
    if (!this.anime || !this.anime.id) {
      console.warn('refreshStats: anime or anime.id is not set', this.anime);
      return;
    }
    
    console.log('refreshStats: fetching comments for anime id:', this.anime.id);
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

  setStatus(status: AnimeStatus) {
    this.animeListService.setAnimeStatus(this.anime.id, status);
    this.currentStatus.set(status);
    this.closeMenu();
  }

  toggleDescription() {
    this.isExpanded.update(v => !v);
  }
}
