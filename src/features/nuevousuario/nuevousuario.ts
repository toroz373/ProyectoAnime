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

  // datos del formulario
  usuario = '';
  link = '';
  password = '';

  // mensajes
  mensaje = '';
  error = false;

  // errores por campo
  usuarioError = '';
  linkError = '';
  passwordError = '';

  // mostrar/ocultar contraseña
  showPassword = false;

  constructor(
    private http: HttpClient,
    private cd: ChangeDetectorRef
  ) {}

  // ojo de la contraseña
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  register() {

    // limpio todo antes de validar
    this.mensaje = '';
    this.error = false;

    this.usuarioError = '';
    this.linkError = '';
    this.passwordError = '';

    // quito espacios por seguridad
    this.usuario = this.usuario.trim();
    this.link = this.link.trim();
    this.password = this.password.trim();

    let hasError = false;

    // validar usuario
    if (this.usuario === '') {
      this.usuarioError = 'El usuario es obligatorio';
      hasError = true;
    }

    // validar link
    if (this.link === '') {

      this.linkError = '';
      this.cd.detectChanges();

      this.linkError = 'El link es obligatorio';
      hasError = true;

    } else if (!this.link.startsWith('@')) {

      this.linkError = '';
      this.cd.detectChanges();

      this.linkError = 'El link debe empezar con @';
      hasError = true;

    } else if (!/^@[a-zA-Z0-9_]+$/.test(this.link)) {

      this.linkError = '';
      this.cd.detectChanges();

      this.linkError = 'El link solo puede contener letras, números y _';
      hasError = true;
    }

    // validar password
    if (this.password === '') {
      this.passwordError = 'La contraseña es obligatoria';
      hasError = true;
    }

    // si hay errores, paro
    if (hasError) {
      this.cd.detectChanges();
      return;
    }

    // si todo está bien, llamo al backend para crear el usuario
    this.http.post<any>(
      'http://localhost/ProyectoAnime/backend-php/api/nuevousuario.php',
      {
        usuario: this.usuario,
        link: this.link,
        password: this.password
      }
    ).subscribe({

      next: (res) => {

        // muestro mensaje según respuesta
        if (res.success) {
          this.mensaje = 'Registro completado correctamente. Bienvenido a MiruZone';
          this.error = false;
        } else {
          this.mensaje = res.message || 'Error en el registro';
          this.error = true;
        }

        this.cd.detectChanges();
      },

      error: () => {

        // error de conexión
        this.mensaje = 'Error de conexión con el servidor';
        this.error = true;

        this.cd.detectChanges();
      }
    });
  }
}