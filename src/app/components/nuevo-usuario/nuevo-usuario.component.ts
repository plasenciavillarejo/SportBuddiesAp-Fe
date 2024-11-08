import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { Popover } from 'bootstrap';
declare var bootstrap: any

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

  errorDireccion!: boolean;

  errorProvincia!: boolean;

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
    // Capturamos el IdUsuario para validar si se acceder para crear un usuario o para actualizarl
    this.activatedRoute.params.subscribe(params => {
      this.idUsuario = params['idUsuario'];
      if (this.idUsuario != null) {
        this.obtainUserComplet(this.idUsuario);
      }
    });

  }

  /**
   * Cargamos el popover, es necesario saber, que debemos hacerlo una vez que el DOM esté completamente cargado. De lo contrario, no funcionará
  */
  ngAfterViewInit(): void {
    // Activa los Popover existentes
    const popoverInit = document.querySelectorAll('[data-bs-toggle="popover"]');
    popoverInit.forEach(popover => {
      new bootstrap.Popover(popover);
    });

    // Activa el Popover en un span
    const idPopoverPassword = document.getElementById('popover-password');
    if (idPopoverPassword) {
      idPopoverPassword.hidden = true;
      new bootstrap.Popover(idPopoverPassword);
    }
  }

  /**
   * Función encargada de crear un nuevo usuario para acceder a la aplicación que retornara a la página de inicio una vez que ha sido creado
   * @param usuario 
   */
  createOrUpdateUser(usuario: Usuario) {
    this.validarCampos(usuario);
    if (this.idUsuario === undefined) {
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
      Swal.fire({
        title: "¿Estás seguro de actualizar los datos?",
        text: "Una vez actualizados, para retroceder, deberá de volver a insetar los datos anteriores",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#0d6efd",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, actualizar!"
      }).then((result) => {
        if (result.isConfirmed) {
          this.usuarioServicio.updateUser(usuario).subscribe({
            next: response => {
              Swal.fire(
                'Usuario actualizao exitosamente',
                'Se ha actualizado correctamente el usuario',
                'success'
              );
            }, error: error => {
              throw new error;
            }
          });
        }
      });
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
    this.errorDireccion = usuario.direccion === undefined || usuario.direccion.trim() === '';
    this.errorProvincia = usuario.provincia === undefined || usuario.provincia.trim() === '';
    this.errorMunicipio = usuario.municipio === undefined || usuario.municipio.trim() === '';
    this.errorCodigoPostal = usuario.codigoPostal === undefined || usuario.codigoPostal.trim() === '';
    this.errorPais = usuario.pais === undefined || usuario.pais.trim() === '';
    this.errorTelefono = usuario.numeroTelefono === undefined || usuario.numeroTelefono.trim() === '';

    if(this.idUsuario === undefined) {
      if (this.errorUsuario || this.errorEmail) {
        throw new Error;
      } else if(!this.validateLengthPassword(this.usuario.password) || this.errorPassword) {
        throw new Error;
      }
    } else if (this.errorUsuario || this.errorEmail || this.errorDireccion || this.errorProvincia || this.errorMunicipio || this.errorCodigoPostal
      || this.errorPais || this.errorTelefono) {
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
        if (response != null) {
          this.usuario = response;
        }
      }, error: error => {
        throw new error;
      }
    });
    return this.usuario;
  }

  passwordRequired!: boolean;

  /**
   * Función encargada de validar los requerimientos de la contraseña
   * @param password 
   * @returns 
   */
  validateLengthPassword(password: any): boolean {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const idPopoverPassword = document.getElementById('popover-password');
    //const passwordValue = password.target.value;
    if (!passwordRegex.test(password) && password !== '') {
      this.passwordRequired = false;
      // Activamos el Popover para que muestre la información del error con más detalle
      if (idPopoverPassword) {
        idPopoverPassword.hidden = false;
        new bootstrap.Popover(idPopoverPassword, {
          html: true,
          content: `
          <ul style="margin: 0; padding: 0; list-style: none; font-size: 0.9em;">
            <li>Debe contener al menos una letra minúscula</li>
            <li>Debe contener al menos una letra mayúscula</li>
            <li>Debe incluir dígitos</li>
            <li>Debe tener un carácter especial (por ejemplo, @$!%*?&)</li>
            <li>Debe tener una longitud mínima de 8 caracteres</li>
            <li>Ejemplo Password: MiContrase1$ </li>
          </ul>
        `,
          trigger: 'hover'
        });
      }
    } else {
      this.passwordRequired = true;
      if (idPopoverPassword) {
        idPopoverPassword.hidden = true;
        new bootstrap.Popover(idPopoverPassword);
      }
    }
    return this.passwordRequired;
  }


}
