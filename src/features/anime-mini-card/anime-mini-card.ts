import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Anime } from '../../core/models/anime.model';

@Component({
  selector: 'app-anime-mini-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './anime-mini-card.html',
  styleUrls: ['./anime-mini-card.css']
})
export class AnimeMiniCardComponent {
  @Input() anime!: Anime;
}
