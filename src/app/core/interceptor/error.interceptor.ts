import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import Swal from 'sweetalert2';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {    
      // Con esta exclusión, evitamos la carga inicial de los combos que de error en caso de que falte la conexíon de algún componente 'error.status !== 0'  
      if(error.status !== 200 && error.status !== 0 && error.status !== 503){
        Swal.fire(
          'Error',
          error.error.mensaje, 
          'error'
        )        
        return throwError(() => new Error());
      } else {
        return next(req);
      }
    })
  );
};
