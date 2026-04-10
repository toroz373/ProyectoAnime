import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nuevacontrasena',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './nuevacontrasena.html',
  styleUrl: './nuevacontrasena.css'
})
export class NuevaContrasenaComponent {
  usuario = '';
  nuevaPassword = '';
  confirmarPassword = '';

  mensaje = '';
  error = false;

  constructor(
    private http: HttpClient,
    private cd: ChangeDetectorRef
  ) {}

  changePassword() {

    this.mensaje = '';
    this.error = false;

    if (!this.usuario || !this.nuevaPassword || !this.confirmarPassword) {
      this.mensaje = 'Debes completar todos los campos';
      this.error = true;
      return;
    }

    if (this.nuevaPassword !== this.confirmarPassword) {
      this.mensaje = 'Las contraseñas no coinciden';
      this.error = true;
      return;
    }

    this.http.post<any>('http://localhost/ProyectoAnime/backend-php/api/nuevacontrasena.php', {
      usuario: this.usuario,
      nuevaPassword: this.nuevaPassword
    }).subscribe({
      next: (res) => {
        this.mensaje = res.message || 'Contraseña cambiada correctamente';
        this.error = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.log('Error completo:', err);
        console.log('Respuesta del servidor:', err.error);

        this.mensaje = err.error?.message || 'Error de conexión con el servidor';
        this.error = true;
      }
    });
  }
}