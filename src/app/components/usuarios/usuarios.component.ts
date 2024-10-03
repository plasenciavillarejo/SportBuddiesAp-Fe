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
import Swal from 'sweetalert2';
import { OAuthModule, OAuthService } from 'angular-oauth2-oidc';

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

  fechaSeleccionada: Date = new Date();

  title: string = 'Realizar Busqueda';

  constructor(private service: UsuarioService,
    private servicioCompartido: ServicioCompartidoService,
    private authService : AuthService,
  ) {

  }

  ngOnInit(): void {
    //this.service.getUsuario().subscribe(usu => this.usuario = usu);
    this.handlerLogin();
  }

  // Suscripción al login
  handlerLogin() {
    this.servicioCompartido.loginhandlerEventEmitter.subscribe(({email, password}) => {
      console.log(email + '' + password);
      //this.authService.login();
      this.authService.loginUser({email,password}).subscribe({
        next: response => {
          // Obtenemos el code para posteriormente enviarlo al login
          const code = response.code;
        },
        error: error => {
          if(error.status == 401) {
            Swal.fire('Error al iniciar sesión', 'Usuario o Password invalidos', 'error');
          }
          throw error;
        }
      });
    });
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
      this.service.getReservas(fechaFormateada).pipe(
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
