import { Component, OnInit, OnDestroy, inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

import { EstadoService } from '../../core/services/estado.service';
import { AnimeMiniCardComponent } from '../anime-mini-card/anime-mini-card';
import { HeaderComponent } from '../header/header';
import { SidebarComponent } from '../sidebar/sidebar';

@Component({
  selector: 'app-deseados',
  standalone: true,
  imports: [CommonModule, AnimeMiniCardComponent, HeaderComponent, SidebarComponent],
  templateUrl: './deseados.html',
  styleUrls: ['./deseados.css']
})
export class DeseadosComponent implements OnInit, OnDestroy {

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

    this.estadoService.getAnimesByStatus(this.userId, 'deseado')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.animes = res || [];
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.loading = false;
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}