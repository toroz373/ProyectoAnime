import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-nuevousuario',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './nuevousuario.html',
  styleUrl: './nuevousuario.css'
})
export class NuevoUsuarioComponent {
  usuario = '';
  link = '';
  password = '';

  mensaje = '';
  error = false;

  constructor(private http: HttpClient, private cd: ChangeDetectorRef) {}

  register() {

    this.mensaje = '';
    this.error = false;

    // validación @
    const valid = /^@[a-zA-Z0-9_]+$/.test(this.link);

    if (!valid) {
      this.mensaje = 'El link debe empezar con @ (ej: @test)';
      this.error = true;
      return;
    }

    this.http.post<any>('http://localhost/ProyectoAnime/backend-php/api/nuevousuario.php', {
      usuario: this.usuario,
      link: this.link,
      password: this.password
    }).subscribe({
      next: (res) => {

        this.mensaje = res.message || 'Registro completado correctamente';
        this.error = false;

        this.cd.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.mensaje = 'Error de conexión con el servidor';
        this.error = true;
      }
    });
  }
}