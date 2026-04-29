import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { HeaderComponent } from '../header/header';
import { SidebarComponent } from '../sidebar/sidebar';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-ajustes',
  standalone: true,
  imports: [FormsModule, CommonModule, SidebarComponent, HeaderComponent],
  templateUrl: './ajustes.html',
  styleUrls: ['./ajustes.css']
})
export class AjustesComponent implements OnInit {

  usuario: any = {};
  editar = false;
  mensajePerfil: string = '';
  mensajeDescripcion: string = '';
  errorPerfil: string = '';

  showDeleteModal = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private auth: AuthService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarPerfil();
  }

  cargarPerfil() {
    const user = this.auth.currentUser();

    if (!user) {
      const storedUser = localStorage.getItem('user');

      if (!storedUser) {
        this.router.navigate(['/login']);
        return;
      }

      const parsedUser = JSON.parse(storedUser);
      this.auth.currentUser.set(parsedUser);
      this.cargarPerfil();
      return;
    }

    this.http.get<any>(
      `http://localhost/ProyectoAnime/backend-php/api/obtener_perfil.php?id=${user.id}`
    ).subscribe(res => {

      if (res.exito) {
        this.usuario = { ...res.usuario };
        if (!this.usuario.theme) this.usuario.theme = 'light';
        this.cd.detectChanges();
      }

    });
  }

  guardarCambios() {
    if (!this.usuario.link || !this.usuario.link.includes('@')) {
      this.errorPerfil = 'El link debe contener @';
      setTimeout(() => this.errorPerfil = '', 3000);
      return;
    }

    this.errorPerfil = '';

    this.http.post<any>(
      'http://localhost/ProyectoAnime/backend-php/api/actualizar_perfil.php',
      {
        id: this.usuario.id,
        usuario: this.usuario.usuario,
        link: this.usuario.link,
        descripcion: this.usuario.descripcion,
        tema: this.usuario.theme
      }
    ).subscribe(() => {

      this.mensajePerfil = 'Perfil actualizado correctamente';
      setTimeout(() => this.mensajePerfil = '', 3000);

      this.cargarPerfil();
      this.usuario = { ...this.usuario };
    });
  }

  cambiarImagen(event: any) {
    const archivo = event.target.files[0];
    if (!archivo) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.usuario.avatar = reader.result as string;
      this.cd.detectChanges();
    };
    reader.readAsDataURL(archivo);

    const formData = new FormData();
    formData.append('imagen', archivo);
    formData.append('id', this.usuario.id);

    this.http.post<any>(
      'http://localhost/ProyectoAnime/backend-php/api/subir_imagen.php',
      formData
    ).subscribe(res => {

      if (res.exito) {
        this.usuario.avatar = res.avatar + '?t=' + new Date().getTime();

        // 🔥 CLAVE: actualizar usuario global
        const current = this.auth.currentUser();
        if (current) {
          this.auth.currentUser.set({
            ...current,
            avatar: this.usuario.avatar
          });
          localStorage.setItem('user', JSON.stringify({
            ...current,
            avatar: this.usuario.avatar
          }));
        }

        this.cd.detectChanges();
      }

    });
  }

  eliminarAvatar() {
    this.http.post<any>(
      'http://localhost/ProyectoAnime/backend-php/api/eliminar_avatar.php',
      { id: this.usuario.id }
    ).subscribe(res => {

      if (res.exito) {
        this.usuario.avatar = null;

        // 🔥 actualizar global
        const current = this.auth.currentUser();
        if (current) {
          this.auth.currentUser.set({
            ...current,
            avatar: undefined
          });
          localStorage.setItem('user', JSON.stringify({
            ...current,
            avatar: null
          }));
        }

        this.cd.detectChanges();
      }

    });
  }

  guardarDescripcion() {
    this.http.post<any>(
      'http://localhost/ProyectoAnime/backend-php/api/actualizar_perfil.php',
      {
        id: this.usuario.id,
        usuario: this.usuario.usuario,
        link: this.usuario.link,
        descripcion: this.usuario.descripcion,
        tema: this.usuario.theme
      }
    ).subscribe(() => {

      this.mensajeDescripcion = 'Descripción guardada correctamente';
      this.cd.detectChanges();

      setTimeout(() => {
        this.mensajeDescripcion = '';
        this.cd.detectChanges();
      }, 3000);

      this.usuario = { ...this.usuario };
    });
  }

  cambiarTema() {
    const nuevoTema = this.usuario.theme === 'dark' ? 'light' : 'dark';
    this.usuario.theme = nuevoTema;

    if (nuevoTema === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }

    this.http.post<any>(
      'http://localhost/ProyectoAnime/backend-php/api/actualizar_perfil.php',
      {
        id: this.usuario.id,
        usuario: this.usuario.usuario,
        link: this.usuario.link,
        descripcion: this.usuario.descripcion,
        tema: nuevoTema
      }
    ).subscribe();
  }

  abrirModalEliminar() {
    this.showDeleteModal = true;
  }

  cerrarModalEliminar() {
    this.showDeleteModal = false;
  }

  confirmarEliminarCuenta() {
    this.eliminarCuenta();
    this.cerrarModalEliminar();
  }

  eliminarCuenta() {
    this.http.post<any>(
      'http://localhost/ProyectoAnime/backend-php/api/eliminar_usuario.php',
      { id: this.usuario.id }
    ).subscribe({
      next: (res) => {
        if (res.ok) {
          localStorage.removeItem('user');
          this.auth.currentUser.set(null);
          this.router.navigate(['/login']);
        }
      }
    });
  }
}