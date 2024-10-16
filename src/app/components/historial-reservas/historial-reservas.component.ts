import { Component } from '@angular/core';
import { Reserva } from '../../models/reserva';
import { ReservasService } from '../../services/reservas.service';
import { ReservasResponse } from '../../models/reservasResponse';
import { TokenService } from '../../services/token.service';
@Component({
  selector: 'app-historial-reservas',
  standalone: true,
  imports: [],
  templateUrl: './historial-reservas.component.html',
  styleUrl: './historial-reservas.component.css'
})
export class HistorialReservasComponent {

  titulo: string = 'Historial de reservas';
  constructor(private reservaService: ReservasService,
    private tokenService: TokenService
  ) {}

  listReservasResponse: ReservasResponse[] = [];

  ngOnInit(): void {
    this.listReservationHistory(this.tokenService.obtainIdUser());
  }

  /**
   * Función encargada de listar las reservas que contiene un usuario
   * @param idUsuario 
   */
  listReservationHistory(idUsuario: number): void {
    this.reservaService.consultReservationsHistory(idUsuario).subscribe({
      next: response => {
        this.listReservasResponse = response;
      }
    })
  }

}
