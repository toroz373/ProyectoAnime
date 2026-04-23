import { Component, AfterViewInit, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { EstadoService } from '../../core/services/estado.service';
import { AnimeMiniCardComponent } from '../anime-mini-card/anime-mini-card';
import { HeaderComponent } from '../header/header';
import { SidebarComponent } from '../sidebar/sidebar';

@Component({
  selector: 'app-procesos',
  standalone: true,
  imports: [CommonModule, AnimeMiniCardComponent, HeaderComponent, SidebarComponent],
  templateUrl: './procesos.html',
  styleUrls: ['./procesos.css']
})
export class ProcesosComponent implements AfterViewInit {

  private estadoService = inject(EstadoService);
  private platformId = inject(PLATFORM_ID);

  animes: any[] = [];
  userId: number = 0;

  ngAfterViewInit() {

    if (isPlatformBrowser(this.platformId)) {

      const checkUser = setInterval(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');

        if (user.id) {
          clearInterval(checkUser);
          this.userId = user.id;

          this.load();
          this.estadoService.refreshTrigger.subscribe(() => this.load());
        }

      }, 50);
    }
  }

  load() {
    if (!this.userId) return;

    this.estadoService.getAnimesByStatus(this.userId, 'en_proceso')
      .subscribe(res => {
        this.animes = [...res];
      });
  }
}
