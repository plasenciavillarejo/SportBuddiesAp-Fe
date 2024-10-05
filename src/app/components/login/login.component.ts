import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent} from '../header/header.component';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../../models/usuario';
import Swal from'sweetalert2';
import { ServicioCompartidoService } from '../../services/servicio-compartido.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterOutlet,HeaderComponent,FormsModule],
  templateUrl: './login.component.html'
})

export class LoginComponent {
  
  usuario: Usuario = new Usuario();;

  constructor(private servicioCompartido: ServicioCompartidoService,
    private http: HttpClient,
    private router: Router) {}

  ngOnInit(): void {

  }

  // Cuando enviemos el usuario que vamos hacer con el
  validacionCredenciales() {
    if(!this.usuario.email || !this.usuario.password) {
      Swal.fire(
        'Error de validación',
        'Usuario y Password requeridos',
        'error'
      )
    } else {
      const body = new HttpParams()
      .set('username', this.usuario.email)
      .set('password', this.usuario.password);
      
      const headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      });

      this.http.post('http://localhost:9000/login', body.toString(), { headers })
        .subscribe({
          next: (response) => {
            console.log('Autenticación exitosa', response);
          },
          error: (error) => {
            console.error('Error en la autenticación', error);
          }
        });
      this.servicioCompartido.loginhandlerEventEmitter.emit({
        email: this.usuario.email,
        password: this.usuario.password
      });
    }
  }


}
