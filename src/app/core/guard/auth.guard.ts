import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';

export const authGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const authServcie = inject(AuthService);
  const router = inject(Router);
  return new Promise(async (resolve, reject) => {
    if (tokenService.isAuthenticate()) {
      if (istTokenExpired()) {
        try {
          // Esperamos a que clearTokenWithCookie finalice antes de redirigir
          await authServcie.clearTokenWithCookie();
          router.navigate(['/login']);
          resolve(false); // Bloquear la navegación
        } catch (error) {
          console.error('Error al limpiar la cookie:', error);
          resolve(false); // En caso de error, también bloquear la navegación
        }
      } else {
        resolve(true); // Permitir la navegación
      }
    } else {
      router.navigate(['/login']);
      resolve(false); // Si no está autenticado, bloquear la navegación
    }
  });
};

const istTokenExpired = () => {
  return inject(TokenService).tokenExpired();
}
