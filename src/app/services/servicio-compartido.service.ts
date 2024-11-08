import { EventEmitter, Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { UsuarioService } from './usuario.service';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';
import { InscripcionReservaActividad } from '../models/inscripcionReservaActividad';

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

  inscripcionReserva: InscripcionReservaActividad = new InscripcionReservaActividad();

  actividadSeleccionada = new Map<number, string>();

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
   * @param idReservaUsuario 
   * @param idUsuario 
   * @param abonado 
   * @returns 
   */
  cancelReservation(idReservaUsuario: number, idUsuario: number, abonado: boolean): Observable<void> {
    return new Observable<void>((observer) => {
      Swal.fire({
        title: "¿Estás seguro de cancelar la Reserva?",
        text: abonado ? "La reserva actualmente se ha pagado, en caso de cancelarla, el pago se realizará en unos días" : '',
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí"
      }).then((result) => {
        if (result.isConfirmed) {
          this.showSpinnerModal();
          this.functionGenericTimeOut(this.usuarioService.deleteActivityRegistered(idReservaUsuario, idUsuario)
          .subscribe({
              next: response => {
                this.hideSpinnerModal();
                // Utilizamos el observer para notificar que la actividad fue eliminada
                observer.next();
                observer.complete();
                Swal.fire({
                  title: "Actividad eliminada!",
                  text: "Se ha eliminado exitosamente la actividad.",
                  icon: "success"
                });
              },
              error: error => {
                this.hideSpinnerModal();
                Swal.fire({
                  title: "Error al cancelar la actividad",
                  text: error.error.mensaje,
                  icon: "error"
                });
                // Notificamos que sucedio un error
                observer.error(error);
              }
            })
          )
        }
      });
    });
  }

  /**
     * Función encargada de recibir todos los id's de las actividades en la que está inscritas el usuario
     * */
  validateActivityUserInscrit(): Observable<number[]> {
    return new Observable<number[]>((observer) => {
      // Obtenemos el id del usuario
      const idUsuario = this.tokenService.obtainIdUser();
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

  /**
     * Función encargada de abrir el modal del spinner
     */
  showSpinnerModal() {
    const spinnerModalElement = document.getElementById('spinner-modal') as HTMLElement;
    if (spinnerModalElement) {
      // Agregamos los elementos a mano para evitar conflicto con bootstrap
      spinnerModalElement.classList.add('show'); // Agrega la clase 'show' para mostrar el modal
      spinnerModalElement.style.display = 'block'; // Block para asegurarnos de que es visible, por defecto, está a none
      document.body.classList.add('modal-open'); // Agrega la clase para evitar el scroll
      const backdrop = document.createElement('div'); // Crea el backdrop
      backdrop.className = 'modal-backdrop fade show'; // Asigna las clases para mostrar el modal
      document.body.appendChild(backdrop); // Agrega el backdrop al cuerpo
    }
  }

  /**
   * Función encargada de cerrar el modal del spinner
   */
  hideSpinnerModal() {
    const spinnerModalElement = document.getElementById('spinner-modal') as HTMLElement;
    if (spinnerModalElement) {
      spinnerModalElement.classList.remove('show'); // Remueve la clase 'show'
      spinnerModalElement.style.display = 'none'; // Oculta el modal
      document.body.classList.remove('modal-open'); // Remueve la clase para permitir el scroll
      const backdrop = document.querySelector('.modal-backdrop'); // Busca el backdrop
      if (backdrop) {
        backdrop.remove(); // Elimina el backdrop
      }
    }
  }

  /**
   * Función genérica que recibe cualquier función para darle un timeout
   * @param object 
   */
  functionGenericTimeOut(object: any): void {
    setTimeout(() => {
      object;
    }, 2000);
  }
  /**
   * Funcion para devovler el id del usuario
   * @returns 
   */
  obtainIdUserGeneric(): number {
    return this.tokenService.obtainIdUser();
  }

  obtainIdUserGenericObservable(): Observable<number> {
    return this.tokenService.obtainIdUserObservable();
  }
  
}
