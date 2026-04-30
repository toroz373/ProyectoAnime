import { Component, OnInit, OnDestroy, inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

import { EstadoService } from '../../core/services/estado.service';
import { HeaderComponent } from '../header/header';
import { SidebarComponent } from '../sidebar/sidebar';

@Component({
  selector: 'app-deseados',
  standalone: true,
  imports: [CommonModule, HeaderComponent, SidebarComponent],
  templateUrl: './deseados.html',
  styleUrls: ['./deseados.css']
})
export class DeseadosComponent implements OnInit, OnDestroy {

  // Servicios que usa el componente
  private estadoService = inject(EstadoService);
  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef);

  // Esto se usa para limpiar las suscripciones al final
  private destroy$ = new Subject<void>();

  // Datos principales
  animes: any[] = [];
  userId: number = 0;
  loading = true;

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    // Coge el usuario guardado
    const userStr = localStorage.getItem('user');

    // Si no hay usuario, no sigue
    if (!userStr) {
      this.loading = false;
      return;
    }

    try {
      const user = JSON.parse(userStr);

      // Si no tiene id válido, se para
      if (!user?.id) {
        this.loading = false;
        return;
      }

      // Guarda el id y lo carga
      this.userId = user.id;
      this.load();

      // Si algo cambia, vuelve a cargar
      this.estadoService.refreshTrigger$
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => this.load());

    } catch {
      this.loading = false;
    }
  }

  load() {
    // Si no hay usuario, no hace nada
    if (!this.userId) return;

    this.loading = true;

    // Pide los animes vistos al servicio
    this.estadoService.getAnimesByStatus(this.userId, 'deseado')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {

          // Ajusta los datos para usarlos más fácil en la vista
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
          console.error('Error loading deseados:', err);
          this.loading = false;
        }
      });
  }

  toggleSinopsis(anime: any) {
    // Mostrar u ocultar sinopsis
    anime.showSinopsis = !anime.showSinopsis;
  }

  toggleMenu(anime: any) {
    // Cierra los otros menús
    this.animes.forEach(a => {
      if (a !== anime) a.showMenu = false;
    });

    // Abre o cierra este
    anime.showMenu = !anime.showMenu;
  }

  moverA(status: any, anime: any) {
    if (!this.userId || !anime?.id) return;

    // Cambia el estado del anime
    this.estadoService.setEstado(this.userId, anime.id, status)
      .subscribe({
        next: () => {
          // Lo quita de la lista
          this.animes = this.animes.filter(a => a.id !== anime.id);
        },
        error: (err) => console.error('Error cambiando estado:', err)
      });
  }

  eliminarDeDeseados(anime: any) {
    if (!this.userId || !anime?.id) return;

    // Elimina el anime
    this.estadoService.deleteEstado(this.userId, anime.id)
      .subscribe({
        next: () => {
          // Lo quita de pantalla
          this.animes = this.animes.filter(a => a.id !== anime.id);
        },
        error: (err) => console.error('Error eliminando anime:', err)
      });
  }

  ngOnDestroy() {
    // Limpia todo al salir
    this.destroy$.next();
    this.destroy$.complete();
  }
}