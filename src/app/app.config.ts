import { ApplicationConfig, inject } from '@angular/core';
import { provideRouter, Router } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),

    // 🔥 Forzar recarga cuando se navega a la misma ruta
    {
      provide: 'forceReloadSameRoute',
      useFactory: () => {
        const router = inject(Router);
        router.onSameUrlNavigation = 'reload';
        return true;
      }
    },

    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch())
  ]
};
