import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ReservasService } from '../../services/reservas.service';
import { FormsModule } from '@angular/forms';
import { ReservasResponse } from '../../models/reservasResponse';
import { TokenService } from '../../services/token.service';
import { RouterLink } from '@angular/router';
import { ServicioCompartidoService } from '../../services/servicio-compartido.service';
import { FormularioActividadResponse } from '../../models/formularioActividadResponse';

@Component({
  selector: 'app-mis-reservas',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './mis-reservas.component.html',
  styleUrl: './mis-reservas.component.css'
})
export class MisReservasComponent implements OnInit {

  constructor(private reservaService: ReservasService,
    private tokenService: TokenService,
    private servicioCompartido: ServicioCompartidoService
  ) {}

  listReservasResponse: ReservasResponse[] = [];
  listaIdInscripcion: any[] = [];

  idReserva!: number;

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
    });
  }

  /**
   * Obtiene el id de la reserva
   * @returns 
   */
  obtainIdReservation(): number {
    return this.idReserva;
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
    

}
