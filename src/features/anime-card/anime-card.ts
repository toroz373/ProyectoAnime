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

  // Datos que recibe la card 
  @Input() anime!: Anime;
  @Input() isLoggedIn = false;
  @Input() currentUserName = '';
  @Input() currentUserId = 0;
  @Input() showStatusButtons = false;

  // Estados internos 
  showComments = signal(false);
  commentsCount = signal(0);
  averageRating = signal(0);
  currentStatus = signal<AnimeStatus | null>(null);

  showMenu = signal(false);
  isExpanded = signal(false);

  // Servicios 
  private commentsService = inject(CommentsService);
  private estadoService = inject(EstadoService);
  private animeListService = inject(AnimeListService);

  private sub?: Subscription;
  private estadoSub?: Subscription; 

  ngOnInit() {

    // cambios en comentarios para actualizar datos
    this.sub = this.commentsService.refreshTrigger.subscribe(() => {
      this.refreshStats();
    });

    // Carga inicial de datos
    setTimeout(() => this.refreshStats(), 0);

    // Si tiene botones de estado, carga el estado del anime
    if (this.showStatusButtons) {
      this.loadEstadoActual();
    }

    // Escucha cambios de estado del anime
    this.estadoSub = this.estadoService.refreshTrigger$.subscribe(() => {
      this.loadEstadoActual();
    });
  }

  ngOnDestroy() {
    // Limpia subscripciones
    this.sub?.unsubscribe();
    this.estadoSub?.unsubscribe(); 
  }

  loadEstadoActual() {
    // Si no hay usuario o anime, no hace nada
    if (!this.currentUserId || !this.anime?.id) return;

    // Pide el estado actual del anime 
    this.estadoService.getEstado(this.currentUserId, this.anime.id)
      .subscribe(res => {
        const status = res?.status ?? null;

        this.currentStatus.set(status);

        // Guarda también en el servicio global
        if (status !== null) {
          this.animeListService.setAnimeStatus(this.anime.id, status);
        }
      });
  }

  // Redondea la media de estrellas
  get averageStars() {
    return Math.round(this.averageRating());
  }

  refreshStats() {
    if (!this.anime?.id) return;

    // Carga número de comentarios
    this.commentsService.getComments(this.anime.id).subscribe(comments => {
      this.commentsCount.set(comments.length);
    });

    // Carga media de estrellas
    this.commentsService.getAverageRating(this.anime.id).subscribe(res => {
      this.averageRating.set(res?.avg_rating || 0);
    });
  }

  toggleComments() {
    // Abre o cierra comentarios
    this.showComments.update(v => !v);
  }

  toggleMenu() {
    // Abre o cierra el menú
    this.showMenu.update(v => !v);
  }

  closeMenu() {
    // Cierra el menú
    this.showMenu.set(false);
  }

  toggleDescription() {
    // Expande o recorta la descripción
    this.isExpanded.update(v => !v);
  }

  setStatus(status: AnimeStatus) {
    // Cambia el estado del anime 
    if (!this.currentUserId || !this.anime?.id) return;

    this.estadoService.setEstado(this.currentUserId, this.anime.id, status)
      .subscribe(() => {
        this.currentStatus.set(status);
        this.animeListService.setAnimeStatus(this.anime.id, status);
      });
  }
}
