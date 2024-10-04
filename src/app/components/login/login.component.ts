import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent} from '../header/header.component';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../../models/usuario';
import Swal from'sweetalert2';
import { ServicioCompartidoService } from '../../services/servicio-compartido.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterOutlet,HeaderComponent,FormsModule],
  templateUrl: './login.component.html'
})

export class LoginComponent {
  
  usuario!: Usuario;

  constructor(private servicioCompartido: ServicioCompartidoService,
    private http: HttpClient) {
    this.usuario = new Usuario();
  }

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
      this.servicioCompartido.loginhandlerEventEmitter.emit({
        email: this.usuario.email,
        password: this.usuario.password
      });
    }
  }


}
