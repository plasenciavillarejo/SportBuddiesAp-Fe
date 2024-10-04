import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario';
import { catchError, throwError } from 'rxjs';
import { format } from 'date-fns';
import { HeaderComponent } from '../header/header.component';
import { RouterOutlet } from '@angular/router';
import { Reserva } from '../../models/reserva';
import { ServicioCompartidoService } from '../../services/servicio-compartido.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})

export class UsuariosComponent implements OnInit {

  usuario: Usuario[] = [];
  reserva: Reserva[] = [];

  listaDeportes: any[] = [];
  listaProvincias: string [] = [];
  listaMunicipos: string [] = []

  fechaSeleccionada: Date = new Date();

  title: string = 'Realizar Busqueda';

  constructor(private usuarioService: UsuarioService,
    private servicioCompartido: ServicioCompartidoService,
    private authService : AuthService,
  ) {

  }

  ngOnInit(): void {
    this.loadComboInitial();
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
      const fechaFormateada = format(this.fechaSeleccionada, 'yyyy-MM-dd');
      console.log('Buscando registros para la fecha', fechaFormateada);
      this.usuarioService.getReservas(fechaFormateada).pipe(
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

  loadComboInitial(): void {
    this.usuarioService.loadComboInit().subscribe( {
      next: (response) => {
        this.listaDeportes = response.listadoDeportes;
        this.listaProvincias = response.listaProvincias;
      }, error: (error) => {
        console.log(error);
      }
    });
  }

  loadMunicipaliti(event: any): void {
    const municipio: string = event.target.value.toString();
    this.usuarioService.loadMunic(municipio).subscribe({
      next: (response) => {
        this.listaMunicipos = response;
      }, error: (error) => {
        console.log(error);
      }
    });

  }

}
