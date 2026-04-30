// Componente principal de la aplicacion
import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../core/services/auth';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  // Titulo de la aplicacion usando signal
  protected readonly title = signal('MiruZone');

  // Servicios inyectados
  private authService = inject(AuthService);
  private http = inject(HttpClient);

  // Flag para saber si estamos en la pagina de login
  isLoginPage = false;

  constructor(private router: Router) {
    // Suscribirse a eventos de navegacion para detectar pagina de login
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isLoginPage = event.url.includes('/login');
      }
    });
  }

  ngOnInit() {
    // Cargar estado de autenticacion al iniciar
    this.authService.loadAuthState();

    // Obtener usuario actual
    const user = this.authService.currentUser();

    // Si hay usuario logueado, cargar su tema
    if (user) {
      this.http.get<any>(
        `http://localhost/ProyectoAnime/backend-php/api/obtener_perfil.php?id=${user.id}`
      ).subscribe(res => {

        if (res.exito) {
          const theme = res.usuario.theme;

          // Aplicar tema oscuro o claro segun la preferencia del usuario
          if (theme === 'dark') {
            document.body.classList.add('dark-mode');
          } else {
            document.body.classList.remove('dark-mode');
          }
        }

      });
    }
  }
}
