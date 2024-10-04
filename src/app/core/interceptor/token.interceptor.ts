import { HttpInterceptorFn } from '@angular/common/http';
import { TokenService } from '../../services/token.service';
import { inject } from '@angular/core';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {

  let intReq = req;
  const token = inject(TokenService).getAccesToken();

  if(token != undefined) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    // Pasamos el request clonado que contiene el token para enviarlo al Be
    return next(authReq);
  }
  return next(req);
};
