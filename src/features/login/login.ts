// Componente de inicio de sesion
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

  // Datos 
  usuario = '';
  password = '';

  // Para mostrar/ocultar la contraseña
  showPassword = false;

  // Mensajes de error
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
    // Cambia entre mostrar y ocultar contraseña
    this.showPassword = !this.showPassword;
  }

  enterAsGuest() {
    // Entrar sin cuenta al feed público
    this.router.navigate(['/public-feed']);
  }

  login() {

    // Limpia errores anteriores
    this.usuarioError = '';
    this.passwordError = '';
    this.loginError = '';
    this.showLoginError = false;

    let hasError = false;

    // Validación del usuario
    if (!this.usuario) {
      this.usuarioError = 'El usuario es obligatorio';
      hasError = true;
    }

    // Validación de la contraseña
    if (!this.password) {
      this.passwordError = 'La contraseña es obligatoria';
      hasError = true;
    }

    // Si hay errores, no sigue
    if (hasError) {
      this.cd.detectChanges();
      return;
    }

    // Petición para hacer login
    this.http.post<any>('http://localhost/ProyectoAnime/backend-php/api/login.php', {
      usuario: this.usuario,
      password: this.password
    }).subscribe({

      next: (response) => {

        if (response.success) {

          // Guarda los datos del usuario en el servicio
          this.authService.login({
            id: response.user.id,
            name: response.user.usuario,
            avatar: response.user.avatar 
          });

          // Aplica tema claro/oscuro según el usuario
          if (response.user.theme === 'dark') {
            document.body.classList.add('dark-mode');
          } else {
            document.body.classList.remove('dark-mode');
          }

          // Redirige al feed privado
          this.router.navigate(['/private-feed']);

        } else {
          // Error si las credenciales no son correctas
          this.loginError = response.message;
          this.showLoginError = true;
          this.cd.detectChanges();
        }
      },

      error: () => {
        // Error si falla la conexión
        this.loginError = 'Error de conexión con el servidor';
        this.showLoginError = true;
        this.cd.detectChanges();
      }
    });
  }
}