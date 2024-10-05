import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { tokenInterceptor } from './core/interceptor/token.interceptor';
import { CookieService } from 'ngx-cookie-service';
import { DatePipe } from '@angular/common';

export const appConfig: ApplicationConfig = {
  // Inyectamos providerHttpClient para poder trabjar con un cliente HTTP y el CookieService para borrarlas
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
     provideRouter(routes),
     // Envolvemos el provideHttpClient con dos interceptores 
     provideHttpClient(withInterceptors([tokenInterceptor])),CookieService, DatePipe]
};
