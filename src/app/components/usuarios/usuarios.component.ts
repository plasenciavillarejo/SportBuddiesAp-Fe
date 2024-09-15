import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario';
import { catchError, throwError } from 'rxjs';
import { format } from 'date-fns';
import { HeaderComponent } from '../header/header.component';
import { RouterOutlet } from '@angular/router';
import { Reserva } from '../../models/reserva';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './usuarios.component.html'
})

export class UsuariosComponent implements OnInit {

  usuario: Usuario[] = [];
  reserva: Reserva[] = [];

  fechaSeleccionada: Date = new Date();

  title: string = 'Fecha en la que desea consultar la busqueda';

  constructor(private service: UsuarioService) {}

  ngOnInit(): void {
    //this.service.getUsuario().subscribe(usu => this.usuario = usu);
  }

  /**
   * Función encargada de mostrar al usuario los eventos dentro de un dia que pueda estar libres para apuntarse
   * @param event 
   */
  handleFechaChange(event: any) {
    this.fechaSeleccionada = new Date(event.target.value);
    if(isNaN(this.fechaSeleccionada.getTime())) {
      // Entonces el usuario ha pulsado en el boton limpiar
      this.reserva = [];
    } else {
      // libreria para formt npm install date-fns --save
      const fechaFormateada = format(this.fechaSeleccionada, 'dd-MM-yyyy');
      console.log('Buscando registros para la fecha', fechaFormateada);
      this.service.getReservas().pipe(
        catchError(error => {
          console.error('Error al cargar usuarios:', error);
          // Puedes manejar el error de otras formas aquí, como mostrar un mensaje al usuario
          return throwError(() => error); // Lanza el error para que se propague
        })
      ).subscribe(res => {
        this.reserva = res; 
      });
    }
  }

}
