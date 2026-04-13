import { Routes } from '@angular/router';

import { LoginComponent } from '../features/login/login';
import { PublicFeedComponent } from '../features/public-feed/public-feed';
import { PrivateFeedComponent } from '../features/private-feed/private-feed';
import { NuevoUsuarioComponent } from '../features/nuevousuario/nuevousuario';
import { NuevaContrasenaComponent } from '../features/nuevacontrasena/nuevacontrasena';
import { AjustesComponent } from '../features/ajustes/ajustes';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'public-feed',
    component: PublicFeedComponent
  },

  {
    path: 'private-feed',
    component: PrivateFeedComponent
  },

  {
    path: 'nuevousuario',
    component: NuevoUsuarioComponent
  },

  {
    path: 'nuevacontrasena',
    component: NuevaContrasenaComponent
  },

  {
    path: 'ajustes',
    component: AjustesComponent
  },

  {
    path: '**',
    redirectTo: 'login'
  }
];
