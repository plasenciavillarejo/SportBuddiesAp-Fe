import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService =  inject(AuthService);
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {    
      // Con esta exclusión, evitamos la carga inicial de los combos que de error en caso de que falte la conexíon de algún componente 'error.status !== 0'  
      if(error.status !== 200 && error.status !== 0 && error.status !== 503){
        if(error.status === 401) {
          authService.logout();
        } else {
        Swal.fire(
          'Error',
          error.error.mensaje, 
          'error'
        )        
      }
        return throwError(() => error); 
      } else  {
        return next(req);
      }
    })
  );
};
