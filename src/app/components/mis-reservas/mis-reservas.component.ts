import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ReservasService } from '../../services/reservas.service';
import { FormsModule } from '@angular/forms';
import { ReservasResponse } from '../../models/reservasResponse';
import { TokenService } from '../../services/token.service';
import { RouterLink } from '@angular/router';
import { ServicioCompartidoService } from '../../services/servicio-compartido.service';

import { CommonModule } from '@angular/common';
import { SpinnerModalComponent } from '../spinner-modal/spinner-modal.component';

@Component({
  selector: 'app-mis-reservas',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule, SpinnerModalComponent],
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
  nombreActividad!: string;
  precioActividad!: number;

  pagoPaypal!: boolean;
  cancelarPago!: boolean;

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
    this.cancelarPago = true;
    // Se le indica para que fuerce actualizar el modal con el ()Input cancelarPago = true, de otra forma, no se podrá visualizar el modal
    this.cdRef.detectChanges();
    this.servicioCompartido.cancelReservation(idReservaUsuario, idUsuario, abonado).subscribe({
      next: () => {
        // Volvemos a consultar el servicio donde se obtiene los id de las actividades inscritas
        this.listReservation(this.tokenService.obtainIdUser(), '');
        this.validateActivityUser();
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
     * Función encargada de agregar el idReservaUsuario y el nombre de la actividad para pasarlo a paypal y el pago con tarjeta
     */
    obtainDataActivity(idReservaUsuario: number, nombreActividad: string, precioActividad: number): void {
      this.idReservaUsuario = idReservaUsuario;
      this.nombreActividad = nombreActividad;
      this.precioActividad = precioActividad;
    }

}
