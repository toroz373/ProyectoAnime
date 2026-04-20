import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { provideHttpClient, withFetch } from '@angular/common/http';

// Configuración de la aplicación - define los providers globales
export const appConfig: ApplicationConfig = {
  providers: [
    // Manejador global de errores
    provideBrowserGlobalErrorListeners(),
    // Proveedor de rutas
    provideRouter(routes),
    // Hidratación del cliente y manejo de eventos
    provideClientHydration(withEventReplay()),
    // Proveedor HttpClient
    provideHttpClient(withFetch())
  ]
};
