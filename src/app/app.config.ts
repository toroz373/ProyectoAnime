// Configuracion global de la aplicacion Angular
import { ApplicationConfig, inject } from '@angular/core';
import { provideRouter, Router } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    // Proveedor de rutas
    provideRouter(routes),

    // Configuracion para forzar recarga al navegar a la misma ruta
    {
      provide: 'forceReloadSameRoute',
      useFactory: () => {
        const router = inject(Router);
        router.onSameUrlNavigation = 'reload';
        return true;
      }
    },

    // Hidratacion del cliente para SSR
    provideClientHydration(withEventReplay()),

    // Cliente HTTP con soporte para Fetch API
    provideHttpClient(withFetch())
  ]
};
