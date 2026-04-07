import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

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

  constructor(private http: HttpClient) {}

  login() {
    this.http.post('http://localhost/backend-php/api/login.php', {
      usuario: this.usuario,
      password: this.password
    }).subscribe(response => {
      console.log(response);
    });
  }
}