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

    // 🔥 SOLO redirige si SABES que no está logueado
    if (!user) {

      const storedUser = localStorage.getItem('user');

      // 🔥 SI NO hay usuario en localStorage → login
      if (!storedUser) {
        this.router.navigate(['/login']);
        return;
      }

      // 🔥 SI sí hay → reconstruir usuario
      const parsedUser = JSON.parse(storedUser);
      this.auth.currentUser.set(parsedUser);

      // 🔁 volver a intentar
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

    // ❌ VALIDACIÓN LINK
    if (!this.usuario.link || !this.usuario.link.includes('@')) {
      this.errorPerfil = 'El link debe contener @';
      
      setTimeout(() => {
        this.errorPerfil = '';
      }, 3000);

      return; // 🚫 no continúa
    }

    // ✅ limpia error si todo bien
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

      setTimeout(() => {
        this.mensajePerfil = '';
      }, 3000);

      this.cargarPerfil();
      this.usuario = { ...this.usuario };
    });
  }

  cambiarImagen(event: any) {
    const archivo = event.target.files[0];
    if (!archivo) return;

    // 🔥 PREVIEW INMEDIATO
    const reader = new FileReader();
    reader.onload = () => {
      this.usuario.avatar = reader.result as string;

      this.cd.detectChanges(); // 🔥 clave real
    };
    reader.readAsDataURL(archivo);

    // 🔥 SUBIDA
    const formData = new FormData();
    formData.append('imagen', archivo);
    formData.append('id', this.usuario.id);

    this.http.post<any>(
      'http://localhost/ProyectoAnime/backend-php/api/subir_imagen.php',
      formData
    ).subscribe(res => {

      if (res.exito) {

        // 🔥 evita caché SIEMPRE
        this.usuario.avatar = res.avatar + '?t=' + new Date().getTime();

        this.cd.detectChanges(); // 🔥 refresco inmediato
      }

    });
  }

  eliminarAvatar() {
    this.http.post<any>(
      'http://localhost/ProyectoAnime/backend-php/api/eliminar_avatar.php',
      { id: this.usuario.id }
    ).subscribe(res => {

      if (res.exito) {

        // 🔥 fuerza imagen por defecto directamente
        this.usuario.avatar = null;

        // 🔥 fuerza render REAL
        this.cd.detectChanges();

        // ❌ NO recargar perfil aquí
        // this.cargarPerfil();  ← QUITAR ESTO
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

      this.cd.detectChanges(); // 🔥 CLAVE

      setTimeout(() => {
        this.mensajeDescripcion = '';
        this.cd.detectChanges(); // 🔥 otra vez
      }, 3000);

      this.usuario = { ...this.usuario };
    });
  }

  cambiarTema() {
    const nuevoTema = this.usuario.theme === 'dark' ? 'light' : 'dark';
    this.usuario.theme = nuevoTema;

    // 🔥 aplicar SIEMPRE primero
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

  confirmarEliminarCuenta() {
    const confirmacion = window.confirm(
      '⚠️ ¿Estás seguro de que quieres eliminar tu perfil? Esta acción no se puede deshacer.'
    );

    if (confirmacion) {
      this.eliminarCuenta();
    }
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
        } else {
          console.error('No se pudo eliminar:', res);
        }
      },
      error: (err) => {
        console.error('Error eliminando cuenta:', err);
      }
    });
  }
}