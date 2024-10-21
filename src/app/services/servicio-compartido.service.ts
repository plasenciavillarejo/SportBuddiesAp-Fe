import { EventEmitter, Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { UsuarioService } from './usuario.service';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class ServicioCompartidoService {

  constructor(private usuarioService: UsuarioService,
    private tokenService: TokenService
  ) { }

  // Inicio de los servicios compartidos, una vez que ceamos el emiter tenemos que irnos al componente donde queramos llamarlo
  private _loginhandlerEventEmitter = new EventEmitter();

  // Este servicio se va a crear dentro de authorize.components.ts y lo va a consumir el header.component.ts
  private _initSessionEventEmitter = new EventEmitter();

  private _redirectHeaderEventEmitter = new EventEmitter();

  get loginhandlerEventEmitter() {
    return this._loginhandlerEventEmitter;
  }

  get initSessionEventEmitter() {
    return this._initSessionEventEmitter;
  }

  get redirectHeaderEventEmitter() {
    return this._redirectHeaderEventEmitter;
  }
 
 /**
   * Función encargada de borrar una activida asociado a un usuario en el caso de que dicha actividad se encuentre pendiente de pago y dentro del plazo preestablecido
   * @param idReseva
   */
  cancelReservation(idReseva: number, idUsuario: number): Observable<void> {
    return new Observable<void>((observer) => {
      Swal.fire({
        title: "¿Estás seguro de cancelar la Reserva?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí"
      }).then((result) => {
        if (result.isConfirmed) {
          this.usuarioService.deleteActivityRegistered(idReseva, idUsuario).subscribe({
            next: response => {
              // Aquí puedes usar el observer para notificar que la actividad fue eliminada
              observer.next();
              observer.complete();
              Swal.fire({
                title: "Actividad eliminada!",
                text: "Se ha eliminado exitosamente la actividad.",
                icon: "success"
              });
            },
            error: error => {
              Swal.fire({
                title: "Error!",
                text: "Ha sucedido un error a la hora de eliminar la actividad. " + error.error.mensaje,
                icon: "error"
              });
              observer.error(error);
            }
          });
        }
      });
    });
  }



  /**
     * Función encargada de recibir todos los id's de las actividades en la que está inscritas el usuario
     * */
  validateActivityUserInscrit(): Observable<number[]> {
    return new Observable<number[]>((observer) => {
      const idUsuario = this.tokenService.obtainIdUser(); // Obtén el id del usuario
      this.usuarioService.listActivityRegistered(idUsuario).subscribe({
        next: response => {
          if (response.length > 0) {
            const listaIdInscripcion: number[] = [];
            response.forEach(id => listaIdInscripcion.push(id));
            observer.next(listaIdInscripcion); // Devuelve el array de ids
          } else {
            observer.next([]); // Si no hay inscripciones, retorna un array vacío
          }
          observer.complete();
        },
        error: error => {
          observer.error(error); // Manejo del error
        }
      });
    });
  }






}
