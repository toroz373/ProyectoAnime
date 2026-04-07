import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-nuevousuario',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './nuevousuario.html',
  styleUrl: './nuevousuario.css'
})
export class NuevoUsuarioComponent {
  usuario = '';
  link_usuario = '';
  password = '';

  constructor(private http: HttpClient) {}

  register() {
    this.http.post('http://localhost/backend-php/api/nuevousuario.php', {
      usuario: this.usuario,
      link_usuario: this.link_usuario,
      password: this.password
    }).subscribe(response => {
      console.log(response);
    });
  }
}