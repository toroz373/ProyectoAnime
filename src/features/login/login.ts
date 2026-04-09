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
  styleUrl: './login.css'
})
export class LoginComponent {
  usuario = '';
  password = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  login() {
    this.http.post<any>('http://localhost/backend-php/api/login.php', {
      usuario: this.usuario,
      password: this.password
    }).subscribe({
      next: (response) => {
        console.log(response);

        if (response.success) {
          this.authService.login({
            id: response.user.id,
            name: response.user.name
          });

          this.router.navigate(['/private-feed']);
        } else {
          alert('Usuario o contraseña incorrectos');
        }
      },
      error: (error) => {
        console.error(error);
        alert('Error al conectar con el servidor');
      }
    });
  }
}