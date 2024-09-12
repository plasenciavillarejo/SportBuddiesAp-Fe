import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario';
import { catchError, throwError } from 'rxjs';
import { format } from 'date-fns';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './usuarios.component.html'
})
export class UsuariosComponent implements OnInit {

  usuario: Usuario[] = [];
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
      this.usuario = [];
    } else {
      // libreria para formt npm install date-fns --save
      const fechaFormateada = format(this.fechaSeleccionada, 'dd-MM-yyyy');
      console.log('Buscando registros para la fecha', fechaFormateada);
      this.service.getUsuario().pipe(
        catchError(error => {
          console.error('Error al cargar usuarios:', error);
          // Puedes manejar el error de otras formas aquí, como mostrar un mensaje al usuario
          return throwError(() => error); // Lanza el error para que se propague
        })
      ).subscribe(usu => {
        this.usuario = usu; // Actualiza la lista de usuarios si la consulta fue exitosa
      });
    }
  }

}
