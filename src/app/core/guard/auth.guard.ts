import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {

  

  // Redirige a la página login
  inject(Router).navigate(['/login'])
  // Retorno 
  return false;
};
