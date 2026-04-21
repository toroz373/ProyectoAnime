import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../features/header/header';
import { SidebarComponent } from '../../features/sidebar/sidebar';
import { EstadoService } from '../../core/services/estado.service';
import { AnimeCardComponent } from '../anime-card/anime-card';

@Component({
  selector: 'app-deseados',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    SidebarComponent,
    AnimeCardComponent
  ],
  templateUrl: './deseados.html',
  styleUrl: './deseados.css'
})
export class DeseadosComponent implements OnInit {

  animes: any[] = [];

  constructor(private estado: EstadoService) {}

  ngOnInit() {
    const userId = 1;
    this.estado.getByEstado(userId, 'deseado').subscribe(data => {
      this.animes = data;
    });
  }
}
