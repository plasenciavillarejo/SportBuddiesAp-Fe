import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario';
import { catchError, throwError } from 'rxjs';
import { format } from 'date-fns';
import { HeaderComponent } from '../header/header.component';
import { RouterOutlet } from '@angular/router';
import { Reserva } from '../../models/reserva';
import { ServicioCompartidoService } from '../../services/servicio-compartido.service';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { FormularioActividadRequest } from '../../models/formularioActividadRequest';
import { FormularioActividadResponse } from '../../models/FormularioActividadResponse';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { TokenService } from '../../services/token.service';
import { InscripcionReservaActividad } from '../../models/inscripcionReservaActividad';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FormsModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})

export class UsuariosComponent implements OnInit {

  usuario: Usuario[] = [];
  reserva: Reserva[] = [];

  listaDeportes: any[] = [];
  listaProvincias: string[] = [];
  listaMunicipos: string[] = []

  idUsuario!: number;
  inscripcionReserva: InscripcionReservaActividad = new InscripcionReservaActividad();

  actividadSeleccionada!: string;

  formularioActividadRequest: FormularioActividadRequest = new FormularioActividadRequest();
  formularioActividadResponse: FormularioActividadResponse[] = [];

  title: string = 'Realizar Busqueda';

  

  constructor(private usuarioService: UsuarioService,
    private servicioCompartido: ServicioCompartidoService,
    private authService: AuthService,
    private datePipe: DatePipe,
    private tokenService: TokenService
  ) {

  }

  ngOnInit(): void {
    this.loadComboInitial();
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

  consultListReservations(): void {
    format(this.formularioActividadRequest.fechaReserva, 'yyyy-MM-dd');
    console.log(this.formularioActividadRequest);
    this.usuarioService.loadReservationList(this.formularioActividadRequest).subscribe({
      next: (response) => {
        if (response.length >=1 ) {
          this.formularioActividadResponse = response;
          this.formularioActividadResponse.forEach(res => {
            res.horaInicio = res.horaInicio.split(':').slice(0,2).join(':');
            res.horaFin = res.horaFin.split(':').slice(0,2).join(':');
          });
          this.validateActivityUserInscrit();     
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


  checkActivity(event: any) {
    this.actividadSeleccionada = event.target.value;
  }

  makeReservationActivity(formActi: FormularioActividadResponse) : string {
    this.inscripcionReserva.idReservaActividad = formActi.idReservaActividad;
    this.inscripcionReserva.fechaReserva = format(formActi.fechaReserva, 'yyyy-MM-dd');
    this.inscripcionReserva.horaInicioReserva = formActi.horaInicio;
    this.inscripcionReserva.horaFinReserva = formActi.horaFin;
    this.inscripcionReserva.idUsuario = this.tokenService.obtainIdUser();
    this.inscripcionReserva.idDeporte = formActi.idReservaActividad;

    this.usuarioService.registrationReservation(this.inscripcionReserva).subscribe({
      next: response => {
        Swal.fire(
          'Inscripción exitosa',
          'Se ha inscrito exitosamente a la actividad '+ this.actividadSeleccionada , 
          'success'
        )
      }, error: error => {
        Swal.fire(
          'Error en la inscripción',
          error.error.mensaje,
          'error'
        )
        this.inscripcionReserva = new InscripcionReservaActividad();
      }
    });
    return 'Se ha realizado la inscripción a la reserva exitosamente';
  }

  validateActivityUserInscrit() {
    this.usuarioService.listActivityRegistered(this.tokenService.obtainIdUser()).subscribe({
      next: response => {
        if(response.length > 0) {
          console.log('aaaaa');
        }
      }, error: error => {
        console.log(error);
      }
    });
  }

}
