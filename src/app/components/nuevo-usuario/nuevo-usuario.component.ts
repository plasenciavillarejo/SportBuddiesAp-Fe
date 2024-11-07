import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-nuevo-usuario',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './nuevo-usuario.component.html',
  styleUrl: './nuevo-usuario.component.css'
})
export class NuevoUsuarioComponent implements OnInit {

  usuario: Usuario = new Usuario();

  errorUsuario!: boolean;

  errorPassword!: boolean;

  errorEmail!: boolean;

  errorMunicipio!: boolean;

  errorCodigoPostal!: boolean;

  errorPais!: boolean;

  errorTelefono!: boolean;

  idUsuario!: number;

  constructor(private usuarioServicio: UsuarioService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {

    // Capturamos el IdUsuario para validar si se acceder para crear un usuario o para actualizarlo
    this.activatedRoute.params.subscribe(params => {
      this.idUsuario = params['idUsuario'];
      this.obtainUserComplet(this.idUsuario);
    });

  }

  /**
   * Función encargada de crear un nuevo usuario para acceder a la aplicación que retornara a la página de inicio una vez que ha sido creado
   * @param usuario 
   */
  createOrUpdateUser(usuario: Usuario) {
    
    if(this.idUsuario == null) {
      this.validarCampos(usuario);
      this.usuarioServicio.createUser(usuario).subscribe({
        next: response => {
          Swal.fire(
            'Usuario creado exitosamente',
            'Se ha registrado correctamente el cliente para la aplicación',
            'success'
          );
          this.router.navigate(['/usuarios']);
        }, error: error => {
          Swal.fire(
            'Error en la creación',
            error.error.mensaje,
            'error'
          );
        }
      });
  
    } else {
      console.log('Falta crear el servicio para llamar al BE');
    }
  }

  /**
   * Función encargada de validar los campos de texto
   * @param usuario 
   */
  private validarCampos(usuario: Usuario): void {
    this.errorUsuario = usuario.nombreUsuario === undefined || usuario.nombreUsuario.trim() === '';
    this.errorPassword = usuario.password === undefined || usuario.password.trim() === '';
    this.errorEmail = usuario.email === undefined || usuario.email.trim() === '';
    if (this.errorUsuario || this.errorPassword || this.errorEmail) {
      throw new Error;
    }
  }

  /**
   * Función encargada de recibir un idUsuario y cargar el usuario completo
   * @param idUsuario 
   * @returns 
   */
  private obtainUserComplet(idUsuario: number): Usuario {
    this.usuarioServicio.obtainUserDto(idUsuario).subscribe({
      next: response => {
        if(response != null) {
          this.usuario = response;
        }
      }, error: error => {
        throw new error;
      }
    });
    return this.usuario;
  }



}
