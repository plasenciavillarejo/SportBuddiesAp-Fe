import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ReservasService } from '../../services/reservas.service';
import { FormsModule } from '@angular/forms';
import { ReservasResponse } from '../../models/reservasResponse';
import { TokenService } from '../../services/token.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-mis-reservas',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './mis-reservas.component.html',
  styleUrl: './mis-reservas.component.css'
})
export class MisReservasComponent implements OnInit {

  constructor(private reservaService: ReservasService,
    private tokenService: TokenService
  ) {}

  listReservasResponse: ReservasResponse[] = [];

  idReserva!: number;

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
