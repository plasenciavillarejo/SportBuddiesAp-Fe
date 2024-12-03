import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfirmarAsistenciaResponse } from '../../models/confirmarAsistenciaResponse';
import { ConfirmarAsistenciaService } from '../../services/confirmar-asistencia.service';
import Swal from 'sweetalert2';
import { Paginador } from '../../models/paginador';
import { CommonModule } from '@angular/common';
import { ConfirmarAsistenciaRequest } from '../../models/confirmarAsistenciaRequest';
import { UsuariosConfirmadosResponse } from '../../models/usuariosConfirmadosResponse';
import { ConfirmarAsistenciaGroup } from '../../models/confirmarAsistenciaGroup';
import { HoraConfirmarAsitenciaGroup } from '../../models/horaConfirmarAsitenciaGroup';

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
  confirmarAsistenciaRequest: ConfirmarAsistenciaRequest = new ConfirmarAsistenciaRequest();
  usuariosConfirmado: UsuariosConfirmadosResponse[] = [];
  groupedData: ConfirmarAsistenciaGroup[] = [];

  initial: boolean = false;

  listIdsConfirm: any[] = [];

  constructor(private activatedRoute: ActivatedRoute,
    private confirmarAsistenciaService: ConfirmarAsistenciaService
  ) {

  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.initial = true;
      this.loadActivityConfirmation(params['idUsuario']);
      this.listLonUserConfirm(params['idUsuario']);
    });
  }


  dayMapHour = new Map<Date, String>();


  /**
   * Función encargada de devolver todas las actividades de un usuario para proceder a su confirmación
   * @param idUsuario 
   */
  loadActivityConfirmation(idUsuario: number): void {
    this.confirmarAsistenciaRequest.idUsuario = idUsuario;
    if(this.initial) {
      this.confirmarAsistenciaRequest.caracteristicasPaginacion.pagina = 1;
      this.confirmarAsistenciaRequest.caracteristicasPaginacion.tamanioPagina = 5;
      this.confirmarAsistenciaRequest.caracteristicasPaginacion.campoOrden = 'hora_inicio_reserva';
      this.confirmarAsistenciaRequest.caracteristicasPaginacion.orden = 1;  
    } else {  
      this.confirmarAsistenciaRequest.caracteristicasPaginacion.pagina = this.paginador.paginaActual;
    }
    this.confirmarAsistenciaService.listConfirmation(this.confirmarAsistenciaRequest).subscribe({
      next: (response) => {
        if(response != null) {
          
          this.groupedData = Object.entries(response.listAsistencia).map(([key, horasMap]) => {
            const [actividad, fecha] = key.split('|');
            // Si no especificoel tipo de horasMap me dará un error.
            const mapHorasUsuario = Object.entries(horasMap as Record<string, ConfirmarAsistenciaResponse[]>).map( ([hora, usuarios]) => ({
              hora,
              usuarios,
            })) as HoraConfirmarAsitenciaGroup[];
            return {
              key,
              actividad,
              fechaReserva: new Date(fecha),
              mapHorasUsuario,
            } as ConfirmarAsistenciaGroup;
          });

          this.groupedData.forEach(group => {
            group.mapHorasUsuario.forEach(usu => {
              usu.usuarios.forEach(usu => {
                usu.horaInicio = usu.horaInicio.split(':').slice(0, 2).join(':');
                usu.horaFin = usu.horaFin.split(':').slice(0, 2).join(':');  
              })
            });
          });

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

  saveUserConfirmation(confirmarAsistenciaResponse: ConfirmarAsistenciaResponse) {
    Swal.fire({
      title: "Confirmación de asistencia",
      text: "Está a punto de confirmar al usuario " + confirmarAsistenciaResponse.nombreUsuario + ". Esta acción es irreversible. ¿Desea continuar?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirmar Asistencia",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.confirmarAsistenciaService.saveUserConfirm(confirmarAsistenciaResponse).subscribe({
          next: (response) => {
            Swal.fire(
              'Usuario confirmado exitosamente',
              'Se ha confirmado el usuario para la actividad seleccionada',
              'success'
            );
            // Volvemos a cargar el listado para excluir el registro que acaba de confirmar
            this.listLonUserConfirm(this.confirmarAsistenciaRequest.idUsuario);
          }, error: (error) => {
            Swal.fire(
              'Error con la confirmación del usuario',
              'Hubo un problema con la confirmación del usuario',
              'error'
            );
          }
        });
      }
    });
  }

  listLonUserConfirm(idUsuario: number) {
    this.confirmarAsistenciaService.obtainListIdUserConfirm(idUsuario).subscribe({
      next: (response) => {
        if(response != null) {
          this.usuariosConfirmado = response;
          console.log(response);
        }
      }, error: (error) => {

      }
    });
  }

  /**
   * Función encargada de validar la confirmación del usuario para poder confirmar un usuario o no.
   * @param confAsist 
   * @returns 
   */
  isConfirmed(confAsist: any): boolean {
    return this.usuariosConfirmado?.some(usuConf => 
      usuConf.idUsuario === confAsist.idUsuario &&
      usuConf.fechaReserva === confAsist.fechaReserva &&
      usuConf.horaInicio.split(':').slice(0, 2).join(':') === confAsist.horaInicio &&
      usuConf.horaFin.split(':').slice(0, 2).join(':') === confAsist.horaFin
    ) ?? false;
  }
  

  trackByFn(index: number, item: any): any {
    return item.idUsuario; // Usa una propiedad única del objeto
  }

}
