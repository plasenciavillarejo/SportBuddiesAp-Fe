import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ReservasService } from '../../services/reservas.service';
import { FormsModule } from '@angular/forms';
import { ReservasResponse } from '../../models/reservasResponse';
import { TokenService } from '../../services/token.service';
import { RouterLink } from '@angular/router';
import { ServicioCompartidoService } from '../../services/servicio-compartido.service';
import { FormularioActividadResponse } from '../../models/formularioActividadResponse';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mis-reservas',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './mis-reservas.component.html',
  styleUrl: './mis-reservas.component.css'
})
export class MisReservasComponent implements OnInit {

  constructor(private reservaService: ReservasService,
    private tokenService: TokenService,
    private servicioCompartido: ServicioCompartidoService,
    private cdRef: ChangeDetectorRef
  ) {}

  listReservasResponse: ReservasResponse[] = [];
  listaIdInscripcion: any[] = [];

  idReservaUsuario!: number;
  pagoEfectivo: boolean = false;

  ngOnInit(): void {
    this.listReservation(this.tokenService.obtainIdUser(), '');
    this.servicioCompartido.validateActivityUserInscrit().subscribe({
      next: response => {
        this.listaIdInscripcion = response;       
      }
    }); 
  }

  /**
   * Función encargada de listar las reservas que contiene un usuario
   * @param idUsuario 
   * @param fechaReserva 
   */
  listReservation(idUsuario: number, fechaReserva: string): void {
    this.reservaService.consultReservations(idUsuario, fechaReserva).forEach(res => {
      this.listReservasResponse = res;
      this.listReservasResponse.forEach(list => {
        list.horaInicioReserva = list.horaInicioReserva.split(':').slice(0,2).join(':');
        list.horaFinReserva = list.horaFinReserva.split(':').slice(0,2).join(':');
      });
    });
  }

  /**
   * Obtiene el id de la reserva
   * @returns 
   */
  obtainIdReservation(): number {
    return this.idReservaUsuario;
  }

  /**
   * Función compartida para cancelar una reserva
   * @param idReseva 
   * @param idUsuario 
   */
  cancelReservation(idReservaUsuario: number, idUsuario: number, abonado: boolean): void {
    this.servicioCompartido.cancelReservation(idReservaUsuario, idUsuario, abonado).subscribe({
      next: () => {
        // Volvemos a consultar el servicio donde se obtiene los id de las actividades inscritas
        this.listReservation(this.tokenService.obtainIdUser(), '');
        this.validateActivityUser();
      },
      error: error => {
        console.error("Error al eliminar la actividad:", error);
      }
    });
  }

  /**
   * Función compartida encargada de recibir todos los id's de las actividades en la que está inscritas el usuario
   * */
    validateActivityUser(): void {
      this.servicioCompartido.validateActivityUserInscrit().subscribe({
        next: response =>  {
          this.listaIdInscripcion = response;
        }
      });    
    }

    /**
     * Función encargada de realizar el pago en efectivo
     * @param idReservaUsuario 
     */
    paymentCash(idReservaUsuario: number) {
      this.pagoEfectivo = true;
      // Se le indica a Angular que verifique inmediatamente si hubo cambios en las propiedades o variables vinculadas al HTML del componente.
      this.cdRef.detectChanges();

      this.servicioCompartido.showSpinnerModal();
      console.log('Se ha obtenido el id de la reserva del usuario: ', idReservaUsuario);
      this.reservaService.paymentCash(idReservaUsuario).subscribe({
        next: response => {
          this.servicioCompartido.hideSpinnerModal();
          Swal.fire(
            'Pago realizado exitosamente',
            response.success,
            'success'
          ) 
          // Volvemos a cargar el listado de la página para que se visualicen los cambios
          this.listReservation(this.tokenService.obtainIdUser(), '');

        }, error: error => {
          this.servicioCompartido.hideSpinnerModal();
          throw new error;
        }
      });
    }

}
