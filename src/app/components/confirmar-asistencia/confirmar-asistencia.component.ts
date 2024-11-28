import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfirmarAsistenciaResponse } from '../../models/confirmarAsistenciaResponse';
import { ConfirmarAsistenciaService } from '../../services/confirmar-asistencia.service';
import Swal from 'sweetalert2';
import { Paginador } from '../../models/paginador';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmar-asistencia',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmar-asistencia.component.html',
  styleUrl: './confirmar-asistencia.component.css'
})
export class ConfirmarAsistenciaComponent implements OnInit{

  confirmarAsistenciaResponse: ConfirmarAsistenciaResponse[] = [];
  paginador: Paginador = new Paginador();

  constructor(private activatedRoute: ActivatedRoute,
    private confirmarAsistenciaService: ConfirmarAsistenciaService
  ) {

  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.loadActivityConfirmation(params['idUsuario']);
    });
  }

  /**
   * Función encargada de devolver todas las actividades de un usuario para proceder a su confirmación
   * @param idUsuario 
   */
  loadActivityConfirmation(idUsuario: number): void {
    // PLASENCIA - FALTA CONFIGURAR EL PAGINADOR (28/11/2024)
    this.confirmarAsistenciaService.listConfirmation(idUsuario).subscribe({
      next: (response) => {
        if(response != null) {
          this.confirmarAsistenciaResponse = response.listAsistencia;
          this.paginador = response.paginador;
        }
      }, error: (error) => {
        Swal.fire( 'Error al obtener el usuario',
          error.error.mensaje,
          'error'
        );
      }
    });
  }

}
