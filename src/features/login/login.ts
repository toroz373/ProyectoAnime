import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  usuario = '';
  password = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  // Redirigir como invitado
  enterAsGuest() {
    this.router.navigate(['/public-feed']);
  }

  // Login con usuario y contraseña
  login() {
    if (!this.usuario || !this.password) {
      alert('Por favor ingresa usuario y contraseña');
      return;
    }

    this.http.post<any>('http://localhost/ProyectoAnime/backend-php/api/login.php', {
      usuario: this.usuario,
      password: this.password
    }).subscribe({
      next: (response) => {
        console.log(response);

        if (response.success) {
          // Guardar info del usuario en AuthService usando id real
          this.authService.login({
            id: response.user.id,
            name: response.user.name
          });

          // Redirigir a private-feed
          this.router.navigate(['/private-feed']);
        } else {
          alert(response.message || 'Usuario o contraseña incorrectos');
        }
      },
      error: (error) => {
        console.error(error);
        alert('Error al conectar con el servidor');
      }
    });
  }
}