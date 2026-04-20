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

  protected readonly title = signal('MiruZone');

  private authService = inject(AuthService);
  private http = inject(HttpClient);

  isLoginPage = false;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isLoginPage = event.url.includes('/login');
      }
    });
  }

  ngOnInit() {
    this.authService.loadAuthState();

    const user = this.authService.currentUser();

    if (user) {
      this.http.get<any>(
        `http://localhost/ProyectoAnime/backend-php/api/obtener_perfil.php?id=${user.id}`
      ).subscribe(res => {

        if (res.exito) {
          const theme = res.usuario.theme;

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
