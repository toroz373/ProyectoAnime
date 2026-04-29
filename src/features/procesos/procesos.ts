import { Component, OnInit, OnDestroy, inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

import { EstadoService } from '../../core/services/estado.service';
import { HeaderComponent } from '../header/header';
import { SidebarComponent } from '../sidebar/sidebar';

@Component({
  selector: 'app-procesos',
  standalone: true,
  imports: [CommonModule, HeaderComponent, SidebarComponent],
  templateUrl: './procesos.html',
  styleUrls: ['./procesos.css']
})
export class ProcesosComponent implements OnInit, OnDestroy {

  private estadoService = inject(EstadoService);
  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef);

  private destroy$ = new Subject<void>();

  animes: any[] = [];
  userId: number = 0;
  loading = true;

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    const userStr = localStorage.getItem('user');

    if (!userStr) {
      this.loading = false;
      return;
    }

    try {
      const user = JSON.parse(userStr);

      if (!user?.id) {
        this.loading = false;
        return;
      }

      this.userId = user.id;

      this.load();

      this.estadoService.refreshTrigger
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => this.load());

    } catch {
      this.loading = false;
    }
  }

  load() {
    if (!this.userId) return;

    this.loading = true;

    this.estadoService.getAnimesByStatus(this.userId, 'en_proceso')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {

          this.animes = (res || []).map((anime: any) => ({
            id: anime.id,
            titulo: anime.titulo || anime.title || '',
            imagen: anime.imagen || anime.image || anime.image_url || '',
            sinopsis: anime.sinopsis || anime.description || '',
            showSinopsis: false,
            showMenu: false
          }));

          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error loading procesos:', err);
          this.loading = false;
        }
      });
  }

  toggleSinopsis(anime: any) {
    anime.showSinopsis = !anime.showSinopsis;
  }

  toggleMenu(anime: any) {
    this.animes.forEach(a => {
      if (a !== anime) a.showMenu = false;
    });

    anime.showMenu = !anime.showMenu;
  }

  moverA(status: any, anime: any) {
    if (!this.userId || !anime?.id) return;

    this.estadoService.setEstado(this.userId, anime.id, status)
      .subscribe({
        next: () => {
          this.animes = this.animes.filter(a => a.id !== anime.id);
        },
        error: (err) => console.error('Error cambiando estado:', err)
      });
  }

  eliminarDeDeseados(anime: any) {
    if (!this.userId || !anime?.id) return;

    this.estadoService.deleteEstado(this.userId, anime.id)
      .subscribe({
        next: () => {
          this.animes = this.animes.filter(a => a.id !== anime.id);
        },
        error: (err) => console.error('Error eliminando anime:', err)
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}