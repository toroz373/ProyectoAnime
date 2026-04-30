// Configuracion de rutas de la aplicacion
import { Routes } from '@angular/router';
import { LoginComponent } from '../features/login/login';
import { PublicFeedComponent } from '../features/public-feed/public-feed';
import { PrivateFeedComponent } from '../features/private-feed/private-feed';
import { NuevoUsuarioComponent } from '../features/nuevousuario/nuevousuario';
import { NuevaContrasenaComponent } from '../features/nuevacontrasena/nuevacontrasena';
import { AjustesComponent } from '../features/ajustes/ajustes';
import { DeseadosComponent } from '../features/deseados/deseados';
import { VistosComponent } from '../features/vistos/vistos';
import { ProcesosComponent } from '../features/procesos/procesos';

// Definicion de todas las rutas disponibles en la app
export const routes: Routes = [
  // Ruta por defecto redirige al login
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  // Pagina de inicio de sesion
  {
    path: 'login',
    component: LoginComponent
  },

  // Feed pubblico (sin autenticacion)
  {
    path: 'public-feed',
    component: PublicFeedComponent
  },

  // Feed privado (requiere autenticacion)
  {
    path: 'private-feed',
    component: PrivateFeedComponent
  },

  // Registro de nuevo usuario
  {
    path: 'nuevousuario',
    component: NuevoUsuarioComponent
  },

  // Recuperacion de contrasena
  {
    path: 'nuevacontrasena',
    component: NuevaContrasenaComponent
  },

  // Configuracion del perfil de usuario
  {
    path: 'ajustes',
    component: AjustesComponent
  },

  // Lista de animes deseados
  {
    path: 'deseados',
    component: DeseadosComponent
  },

  // Lista de animes vistos
  {
    path: 'vistos',
    component: VistosComponent
  },

  // Lista de animes en proceso
  {
    path: 'procesos',
    component: ProcesosComponent
  },

  // Ruta comodin para cualquier URL no encontrada
  {
    path: '**',
    redirectTo: 'login'
  }
];
