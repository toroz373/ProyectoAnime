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

  usuario = '';
  password = '';

  showPassword = false;

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

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  enterAsGuest() {
    this.router.navigate(['/public-feed']);
  }

  login() {

    this.usuarioError = '';
    this.passwordError = '';
    this.loginError = '';
    this.showLoginError = false;

    let hasError = false;

    if (!this.usuario) {
      this.usuarioError = 'El usuario es obligatorio';
      hasError = true;
    }

    if (!this.password) {
      this.passwordError = 'La contraseña es obligatoria';
      hasError = true;
    }

    if (hasError) {
      this.cd.detectChanges();
      return;
    }

    this.http.post<any>('http://localhost/ProyectoAnime/backend-php/api/login.php', {
      usuario: this.usuario,
      password: this.password
    }).subscribe({

      next: (response) => {

        if (response.success) {

          // 🔥 AQUÍ ESTÁ LA CLAVE
          this.authService.login({
            id: response.user.id,
            name: response.user.usuario,
            avatar: response.user.avatar // ✅ AÑADIDO
          });

          // tema
          if (response.user.theme === 'dark') {
            document.body.classList.add('dark-mode');
          } else {
            document.body.classList.remove('dark-mode');
          }

          this.router.navigate(['/private-feed']);

        } else {
          this.loginError = response.message;
          this.showLoginError = true;
          this.cd.detectChanges();
        }
      },

      error: () => {
        this.loginError = 'Error de conexión con el servidor';
        this.showLoginError = true;
        this.cd.detectChanges();
      }
    });
  }
}