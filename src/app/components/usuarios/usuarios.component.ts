import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario';
import { throwError } from 'rxjs';
import { format } from 'date-fns';
import { HeaderComponent } from '../header/header.component';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { Reserva } from '../../models/reserva';
import { ServicioCompartidoService } from '../../services/servicio-compartido.service';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { FormularioActividadRequest } from '../../models/formularioActividadRequest';
import { FormularioActividadResponse } from '../../models/formularioActividadResponse';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { TokenService } from '../../services/token.service';
import { InscripcionReservaActividad } from '../../models/inscripcionReservaActividad';
import { PaypalService } from '../../services/paypal.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FormsModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})

export class UsuariosComponent implements OnInit {

  title: string = 'Realizar Busqueda';
  
  paymentId: string = '';
  payerId: string = '';

  usuario: Usuario[] = [];
  reserva: Reserva[] = [];

  listaDeportes: any[] = [];
  listaProvincias: string[] = [];
  listaMunicipos: string[] = []
  listaIdInscripcion: any[] = [];

  idUsuario!: number;
  inscripcionReserva: InscripcionReservaActividad = new InscripcionReservaActividad();

  actividadSeleccionada = new Map<number, string>();

  formularioActividadRequest: FormularioActividadRequest = new FormularioActividadRequest();
  formularioActividadResponse: FormularioActividadResponse[] = [];

  constructor(private usuarioService: UsuarioService,
    private servicioCompartido: ServicioCompartidoService,
    private authService: AuthService,
    private datePipe: DatePipe,
    private tokenService: TokenService,
    private activatedRoute: ActivatedRoute,
    private paypalService: PaypalService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadComboInitial();
    this.validateActivityUserInscrit();

    // Se espera la repuesta de paypal cuando se procede a confirmar el pago
    this.activatedRoute.queryParams.subscribe(data => {
      // En el caso de que el usuario le de atras, enviará la peticion al componente paypal-cancel y este redirigiara de nuevo aqúi con un param
      if(data['cancel-paypal'] === 'true') {
        Swal.fire(
          'Pago cancelado',
          'Se ha cancelado el pago, para más info',
          'info'
        );
        // Reemplaza la URL en el historial para que no contenga el paymentId y el payerId
        this.router.navigate(['/usuarios'], { replaceUrl: true }); 
      }
      this.paymentId = data['paymentId'];
      this.payerId = data['PayerID'];


      if (this.paymentId != null && this.payerId != null) {
        this.paypalService.confirmPayment(this.paymentId, this.payerId).subscribe({
          next: response => {
            if (response.success) {
              Swal.fire(
                'Pago confirmado',
                'Se ha realizado el pago exitosamente',
                'success'
              );
            } else {
              Swal.fire(
                'Error',
                'Ha sucedido un problema con el pago: ' + response.error,
                'error'
              );
            }
            // Reemplaza la URL en el historial para que no contenga el paymentId y el payerId
            this.router.navigate(['/usuarios'], { replaceUrl: true }); 
          },
            error: error => {
            Swal.fire(
              'Error',
              'Ha sucedido un problema con el pago: ' + error,
              'error'
            );
          }
        });
      } 
    });

  }

  /**
   * Función encargada de mostrar al usuario los eventos dentro de un dia que pueda estar libres para apuntarse
   * @param event 
   */
  handleFechaChange(event: any) {
    this.formularioActividadRequest.fechaReserva = new Date(event.target.value);
    if (isNaN(this.formularioActividadRequest.fechaReserva.getTime())) {
      // Entonces el usuario ha pulsado en el boton limpiar
      this.reserva = [];
    } else {
      // libreria para formt npm install date-fns --save
      const fechaFormateada = format(this.formularioActividadRequest.fechaReserva, 'yyyy-MM-dd');
      console.log('Buscando registros para la fecha', fechaFormateada);
    }
  }

  /**
   * Función encargada de cargar los datos necesarios cuando carga la página inicial
   */
  loadComboInitial(): void {
    this.usuarioService.loadComboInit().subscribe({
      next: (response) => {
        this.listaDeportes = response.listadoDeportes;
        this.listaProvincias = response.listaProvincias;
      }, error: (error) => {
        console.log(error);
      }
    });
  }

  /**
   * Funciçon encargada de cargar los municipos asociados a una provincia
   * @param event 
   */
  loadMunicipaliti(event: any): void {
    const municipio: string = event.target.value.toString();
    this.usuarioService.loadMunic(municipio).subscribe({
      next: (response) => {
        this.listaMunicipos = response;
      }, error: (error) => {
        console.log(error);
      }
    });
  }

  /**
   * Función encargada de visualizar las actividades en la página principal
   */
  consultListReservations(): void {
    format(this.formularioActividadRequest.fechaReserva, 'yyyy-MM-dd');
    console.log(this.formularioActividadRequest);
    this.usuarioService.loadReservationList(this.formularioActividadRequest).subscribe({
      next: (response) => {
        if (response.length >= 1) {
          this.formularioActividadResponse = response;
          this.formularioActividadResponse.forEach(res => {
            res.horaInicio = res.horaInicio.split(':').slice(0, 2).join(':');
            res.horaFin = res.horaFin.split(':').slice(0, 2).join(':');
          });
        } else {
          this.formularioActividadResponse = [];
          Swal.fire(
            'Resultado vacío',
            'No existen datos para dichas características',
            'info'
          )
        }
      }, error: (error) => {
        console.log(error);
      }
    })
  }

  /**
   * Funcion encargada de obtener el id y el value de actividad seleccionada en la busqueda para posteriormente cuando se cree la reserva agregarlo directamente
   * @param event 
   */
  checkActivity(event: any) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedOption = selectElement.selectedOptions[0];
    if(this.actividadSeleccionada.size >= 1) {
      this.actividadSeleccionada = new Map<number, string>();
    } 
    this.actividadSeleccionada.set(Number(selectedOption.id), selectedOption.value);
  }

  /**
   * Función encargada de la inscripción para la reseva de la actividad
   * @param formActi 
   * @returns 
   */
  makeReservationActivity(formActi: FormularioActividadResponse): string {
    if (!this.tokenService.isAuthenticate()) {
      Swal.fire(
        'Error',
        'Para realizar alguna inscripción de una actividad debe estar logueado. ¡Por favor, Inicie Sesión!',
        'error'
      );
    }
    Swal.fire({
      title: "¿Realizar Reserva?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí!"
    }).then((result) => {
      if (result.isConfirmed) {
        let deporte: string = '';
        this.inscripcionReserva.idReservaActividad = formActi.idReservaActividad;
        this.inscripcionReserva.fechaReserva = format(formActi.fechaReserva, 'yyyy-MM-dd');
        this.inscripcionReserva.horaInicioReserva = formActi.horaInicio;
        this.inscripcionReserva.horaFinReserva = formActi.horaFin;
        this.inscripcionReserva.idUsuario = this.tokenService.obtainIdUser();
        this.actividadSeleccionada.forEach((key, value) => {
          this.inscripcionReserva.idDeporte = value;
          deporte = key;
        })
        this.usuarioService.registrationReservation(this.inscripcionReserva).subscribe({
          next: response => {
            Swal.fire(
              'Inscripción exitosa',
              'Se ha inscrito exitosamente a la actividad: ' + deporte,
              'success'
            )
            this.validateActivityUserInscrit();
          }, error: error => {
            Swal.fire(
              'Error en la inscripción',
              error.error.mensaje,
              'error'
            )
            this.inscripcionReserva = new InscripcionReservaActividad();
          }
        });
      }
    });
    return 'Se ha realizado la inscripción a la reserva exitosamente';
  }

  /**
   * Función encargada de recibir todos los id's de las actividades en la que está inscritas el usuario
   * */
  validateActivityUserInscrit(): void {
    this.usuarioService.listActivityRegistered(this.tokenService.obtainIdUser()).subscribe({
      next: response => {
        if (response.length > 0) {
          // Vacío el ARRAY en el caso de que exista id's para evitar la duplicidad
          this.listaIdInscripcion = [];
          response.forEach(id => this.listaIdInscripcion.push(id));
        }
      }, error: error => {
        return throwError(() => new Error());
      }
    });
  }

  /**
   * Función encargada de borrar una activida asociado a un usuario en el caso de que dicha actividad se encuentre pendiente de pago y dentro del plazo preestablecido
   * @param idReseva
   */
  cancelReservation(idReseva: number, idUsuario: number): void{
    Swal.fire({
      title: "¿Estás seguro de cancelar la Reserva?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí"
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.deleteActivityRegistered(idReseva,idUsuario).subscribe({
          next: response => {
            // Volvemos a consultar el servicio donde se obtiene los id de las actividades inscritas
            this.validateActivityUserInscrit();
            Swal.fire({
              title: "Actividad eliminada!",
              text: "Se ha elminado exitosamente la actividad.",
              icon: "success"
            });
          }, error: error =>{
            Swal.fire({
              title: "Error!",
              text: "Ha sucedido un error a la hora de eliminar la actividad." + error.error.mensaje,
              icon: "error"
            });
          }
        })
      }
    });
  }

}
