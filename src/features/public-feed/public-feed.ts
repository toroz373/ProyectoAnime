import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimeService } from '../../core/services/anime';
import { AnimeCardComponent } from '../anime-card/anime-card';
import { AuthService } from '../../core/services/auth';
import { HeaderComponent } from '../header/header';

@Component({
  selector: 'app-public-feed',
  standalone: true,
  imports: [AnimeCardComponent, CommonModule, HeaderComponent],
  templateUrl: './public-feed.html',
  styleUrl: './public-feed.css'
})
export class PublicFeedComponent {

  protected authService = inject(AuthService);

  constructor(protected animeService: AnimeService) {}

  ngOnInit() {
    document.body.classList.remove('dark-mode');
  }

  // En el feed público SIEMPRE devolvemos 0
  get currentUserId(): number {
    return 0;
  }

  // Lista de animes
  get animes() {
    return this.animeService.filteredAnimes;
  }

  isSortOpen = false;
  selectedSortLabel = 'Valoraciones';

  toggleSort() {
    this.isSortOpen = !this.isSortOpen;
  }

  selectSort(option: 'rating' | 'az') {
    this.animeService.setSortOption(option);
    this.selectedSortLabel = option === 'rating' ? 'Valoraciones' : 'A-Z';
    this.isSortOpen = false;
  }
}
