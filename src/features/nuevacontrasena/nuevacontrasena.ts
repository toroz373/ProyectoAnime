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

  // datos del formulario
  usuario = '';
  nuevaPassword = '';
  confirmarPassword = '';

  // mensajes
  mensaje = '';
  error = false;

  // errores por campo
  usuarioError = '';
  passwordError = '';
  confirmarError = '';

  // ojito para mostrar/ocultar contraseña
  showPassword1 = false;
  showPassword2 = false;

  constructor(
    private http: HttpClient,
    private cd: ChangeDetectorRef
  ) {}

  // ojo cerrado/abierto
  togglePassword(type: number) {
    if (type === 1) this.showPassword1 = !this.showPassword1;
    if (type === 2) this.showPassword2 = !this.showPassword2;
  }

  changePassword() {

    // limpio todo antes de validar otra vez
    this.mensaje = '';
    this.error = false;

    this.usuarioError = '';
    this.passwordError = '';
    this.confirmarError = '';

    let hasError = false;

    const usuario = this.usuario.trim();
    const pass1 = this.nuevaPassword.trim();
    const pass2 = this.confirmarPassword.trim();

    // validar usuario
    if (!usuario) {
      this.usuarioError = 'El usuario es obligatorio';
      hasError = true;
    }

    // validar nueva contraseña
    if (!pass1) {
      this.passwordError = 'La nueva contraseña es obligatoria';
      hasError = true;
    }

    // validar confirmación
    if (!pass2) {
      this.confirmarError = 'Debes confirmar la contraseña';
      hasError = true;
    }

    // si hay errores de campos, paro
    if (hasError) return;

    // comprobar que las dos contraseñas coinciden
    if (pass1 !== pass2) {
      this.mensaje = 'Las contraseñas no coinciden';
      this.error = true;
      return;
    }

    // si todo está bien, llamo al backend para cambiarla
    this.http.post<any>(
      'http://localhost/ProyectoAnime/backend-php/api/nuevacontrasena.php',
      {
        usuario: usuario,
        nuevaPassword: pass1
      }
    ).subscribe({

      next: (res) => {

        // si todo sale bien o mal, muestro mensaje del backend
        this.mensaje = res.success
          ? 'Contraseña actualizada correctamente. Ya puedes iniciar sesión con tu nueva contraseña'
          : res.message;

        this.error = !res.success;

        this.cd.detectChanges();
      },

      error: () => {

        // error de conexión con el servidor
        this.mensaje = 'Error de conexión con el servidor';
        this.error = true;

        this.cd.detectChanges();
      }
    });
  }
}