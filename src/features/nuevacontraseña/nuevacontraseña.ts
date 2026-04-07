import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-nuevacontraseña',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './nuevacontraseña.html',
  styleUrl: './nuevacontraseña.css'
})
export class NuevaContraseñaComponent {
  usuario = '';
  nuevaPassword = '';

  constructor(private http: HttpClient) {}

  changePassword() {
    this.http.post('http://localhost/backend-php/api/nuevacontraseña.php', {
      usuario: this.usuario,
      nuevaPassword: this.nuevaPassword
    }).subscribe(response => {
      console.log(response);
    });
  }
}