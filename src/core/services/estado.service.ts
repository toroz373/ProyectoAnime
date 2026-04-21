import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class EstadoService {

  private url = 'http://localhost/ProyectoAnime/backend-php/api/estado.php';

  constructor(private http: HttpClient) {}

  // Guardar o actualizar estado
  setEstado(userId: number, animeId: number, estado: string) {
    return this.http.post(this.url, {
      user_id: userId,
      anime_id: animeId,
      status: estado
    });
  }

  // Obtener animes por estado
  getByEstado(userId: number, estado: string) {
    return this.http.get<any[]>(`${this.url}?user_id=${userId}&status=${estado}`);
  }
}
