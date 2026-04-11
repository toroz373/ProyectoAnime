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
  @Input() showStatusButtons = false;

  showComments = signal(false);
  commentsCount = 0;
  userRating = signal(0);
  currentStatus = signal<AnimeStatus | null>(null);
  showMenu = signal(false);

  // NUEVO: Mostrar más / menos
  isExpanded = signal(false);

  private commentsService = inject(CommentsService);
  private animeListService = inject(AnimeListService);

  ngOnInit() {
    this.commentsService.getComments(this.anime.id).subscribe(comments => {
      this.commentsCount = comments.length;
    });

    if (this.showStatusButtons) {
      this.currentStatus.set(this.animeListService.getAnimeStatus(this.anime.id));
    }
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

  setRating(stars: number) {
    if (this.isLoggedIn) {
      this.userRating.set(stars);
    }
  }

  setStatus(status: AnimeStatus) {
    this.animeListService.setAnimeStatus(this.anime.id, status);
    this.currentStatus.set(status);
    this.closeMenu();
  }

  // NUEVO: Alternar descripción
  toggleDescription() {
    this.isExpanded.update(v => !v);
  }
}
