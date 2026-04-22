import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstadoService } from '../../core/services/estado.service';
import { AnimeCardComponent } from '../anime-card/anime-card';
import { Anime } from '../../core/models/anime.model';

@Component({
  selector: 'app-vistos',
  standalone: true,
  imports: [
    CommonModule,
    AnimeCardComponent
  ],
  templateUrl: './vistos.html',
  styleUrl: './vistos.css'
})
export class VistosComponent implements OnInit {

  private estadoService = inject(EstadoService);

  animes: Anime[] = [];
  userId = 1;

ngOnInit() {
  this.estadoService
    .getAnimesByStatus(this.userId, 'visto')
    .subscribe((res: any) => {
      console.log("RESULTADO DEL BACKEND:", res);
      this.animes = res;
    });
}

}
