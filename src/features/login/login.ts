import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../core/services/auth';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, HttpClientModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  // datos del formulario
  usuario = '';
  password = '';

  // para mostrar/ocultar contraseña
  showPassword = false;

  // mensajes de error
  usuarioError = '';
  passwordError = '';
  loginError = '';
  showLoginError = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private cd: ChangeDetectorRef
  ) {}

  // alterna el ojo de la contraseña
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  // entrar sin login
  enterAsGuest() {
    this.router.navigate(['/public-feed']);
  }

  login() {

    // limpio errores antes de validar
    this.usuarioError = '';
    this.passwordError = '';
    this.loginError = '';
    this.showLoginError = false;

    let hasError = false;

    // validación usuario
    if (!this.usuario) {
      this.usuarioError = 'El usuario es obligatorio';
      hasError = true;
    }

    // validación contraseña
    if (!this.password) {
      this.passwordError = 'La contraseña es obligatoria';
      hasError = true;
    }

    // si hay errores, paro
    if (hasError) {
      this.cd.detectChanges();
      return;
    }

    // hago la petición al backend para loguear
    this.http.post<any>('http://localhost/ProyectoAnime/backend-php/api/login.php', {
      usuario: this.usuario,
      password: this.password
    }).subscribe({

      next: (response) => {

        // si todo va bien, guardo el usuario y entro
        if (response.success) {

          this.authService.login({
            id: response.user.id,
            name: response.user.usuario
          });

          // 🔥 aplicar tema del usuario
          if (response.user.theme === 'dark') {
            document.body.classList.add('dark-mode');
          } else {
            document.body.classList.remove('dark-mode');
          }

          this.router.navigate(['/private-feed']);

        } else {

          // si el backend devuelve error
          this.loginError = response.message;
          this.showLoginError = true;
          this.cd.detectChanges();
        }
      },

      error: () => {

        // error de conexión con el servidor
        this.loginError = 'Error de conexión con el servidor';
        this.showLoginError = true;
        this.cd.detectChanges();
      }
    });
  }
}