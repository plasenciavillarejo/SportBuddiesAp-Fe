import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ReservasService } from '../../services/reservas.service';
import { FormsModule } from '@angular/forms';
import { ReservasResponse } from '../../models/reservasResponse';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-mis-reservas',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './mis-reservas.component.html',
  styleUrl: './mis-reservas.component.css'
})
export class MisReservasComponent implements OnInit {

  constructor(private reservaService: ReservasService,
    private tokenService: TokenService
  ) {}

  listReservasResponse: ReservasResponse[] = [];

  ngOnInit(): void {
    this.listReservation(this.tokenService.obtainIdUser(), '');
  }

  /**
   * Función encargada de listar las reservas que contiene un usuario
   * @param idUsuario 
   * @param fechaReserva 
   */
  listReservation(idUsuario: number, fechaReserva: string): void {
    this.reservaService.consultReservations(idUsuario, fechaReserva).subscribe({
      next: response => {
        this.listReservasResponse = response;
      }
    })
  }

}
