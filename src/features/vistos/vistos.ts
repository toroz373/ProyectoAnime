import { Component, OnInit, OnDestroy, inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

import { EstadoService } from '../../core/services/estado.service';
import { AnimeMiniCardComponent } from '../anime-mini-card/anime-mini-card';
import { HeaderComponent } from '../header/header';
import { SidebarComponent } from '../sidebar/sidebar';

@Component({
  selector: 'app-vistos',
  standalone: true,
  imports: [CommonModule, AnimeMiniCardComponent, HeaderComponent, SidebarComponent],
  templateUrl: './vistos.html',
  styleUrls: ['./vistos.css']
})
export class VistosComponent implements OnInit, OnDestroy {

  private estadoService = inject(EstadoService);
  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef);

  private destroy$ = new Subject<void>();

  animes: any[] = [];
  userId: number = 0;
  loading = true;

  ngOnInit() {
    // Evita problemas con SSR
    if (!isPlatformBrowser(this.platformId)) return;

    const userStr = localStorage.getItem('user');

    if (!userStr) {
      console.warn('No hay user en localStorage');
      this.loading = false;
      return;
    }

    try {
      const user = JSON.parse(userStr);

      if (!user?.id) {
        console.warn('User sin id:', user);
        this.loading = false;
        return;
      }

      this.userId = user.id;

      // 🔥 Carga inicial
      this.load();

      // 🔥 Escucha cambios
      this.estadoService.refreshTrigger
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.load();
        });

    } catch (e) {
      console.error('Error parseando user:', e);
      this.loading = false;
    }
  }

  load() {
    if (!this.userId) return;

    this.loading = true;

    this.estadoService.getAnimesByStatus(this.userId, 'visto')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          console.log('Respuesta API:', res);
          this.animes = res || [];
          this.loading = false;

          // 🔥 Fuerza actualización de vista
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error cargando animes:', err);
          this.loading = false;
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}