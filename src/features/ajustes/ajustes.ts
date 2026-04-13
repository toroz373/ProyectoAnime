import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-ajustes',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './ajustes.html',
  styleUrls: ['./ajustes.css']
})
export class AjustesComponent implements OnInit {

  usuario: any = {
    theme: 'light'
  };
  editar = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit() {

    // 🔥 SIMULACIÓN DE USUARIO (solo desarrollo)
    this.auth.currentUser.set({
        id: 1,
        name: 'test'
    });

    this.cargarPerfil();
    }

  cargarPerfil() {
    const user = this.auth.currentUser();

    if (!user) {
    this.router.navigate(['/login']);
    return;
    }

    const id = user.id;

    this.http.get<any>(
      `http://localhost/ProyectoAnime/backend-php/api/obtener_perfil.php?id=${id}`
    ).subscribe(res => {
      if (res.exito) {
        this.usuario = res.usuario;
      }
    });
  }

  guardarCambios() {
    this.http.post<any>(
      'http://localhost/ProyectoAnime/backend-php/api/actualizar_perfil.php',
      {
        id: this.usuario.id,
        usuario: this.usuario.usuario,
        link: this.usuario.link,
        descripcion: this.usuario.descripcion,
        tema: this.usuario.theme
      }
    ).subscribe(res => {
      alert('Perfil actualizado');
      this.editar = false;
    });
  }

  cambiarImagen(event: any) {
    const archivo = event.target.files[0];

    const formData = new FormData();
    formData.append('imagen', archivo);
    formData.append('id', this.usuario.id);

    this.http.post<any>(
      'http://localhost/ProyectoAnime/backend-php/api/subir_imagen.php',
      formData
    ).subscribe(res => {
      if (res.exito) {
        this.usuario.avatar = res.avatar;
      }
    });
  }

  cerrarSesion() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  cambiarTema() {
    this.usuario.theme = this.usuario.theme === 'dark' ? 'light' : 'dark';
  }
}