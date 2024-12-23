import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario';
import { AbstractControl, FormBuilder, FormGroup,  ReactiveFormsModule, ValidationErrors,  Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
declare var bootstrap: any

@Component({
  selector: 'app-nuevo-usuario',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './nuevo-usuario.component.html',
  styleUrl: './nuevo-usuario.component.css'
})
export class NuevoUsuarioComponent implements OnInit {

  usuario: Usuario = new Usuario(); 

  errorPassword!: boolean;
  idUsuario!: number;
  passwordRequired!: boolean;

  validateForm!: FormGroup;
  formSubmit!: boolean;

  listaProvincias: any[] = [];
  listaMunicipos: string[] = []

  nacionalidadesEuropeas = [
    { codigo: 'ES', pais: 'España' },
    { codigo: 'IT', pais: 'Italia' },
    { codigo: 'FR', pais: 'Francia' },
    { codigo: 'DE', pais: 'Alemania' },
    { codigo: 'GB', pais: 'Reino Unido' },
    { codigo: 'PT', pais: 'Portugal' },
    { codigo: 'NL', pais: 'Países Bajos' },
    { codigo: 'BE', pais: 'Bélgica' },
    { codigo: 'SE', pais: 'Suecia' },
    { codigo: 'PL', pais: 'Polonia' }
  ];
  
  constructor(private usuarioService: UsuarioService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
  ) {
  }

  ngOnInit(): void {
    // Capturamos el IdUsuario para validar si se acceder para crear un usuario o para actualizarl
    this.activatedRoute.params.subscribe(params => {
      this.idUsuario = params['idUsuario'];
      if (this.idUsuario != null) {
        // Inicializamos la validacion de angular con los formularios reactivos
        this.initFormReactiveComplet();
        this.obtainUserComplet(this.idUsuario);
      } else {
        this.initFormReactiveNewUser();
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
  createOrUpdateUser() {
    this.formSubmit = true;

    // Validacion formulario reactivo
    if (this.idUsuario == null && this.validateForm.invalid && this.validarPassword(this.validateForm)) {
      return;
    } else if (this.idUsuario != null && this.validateForm.invalid) {
      return;
    }
    // Transformamos el formulario reactivo en un objeto usuario
    const usuarioData: Usuario = this.validateForm.value as Usuario;

    if (this.idUsuario === undefined) {
      this.usuarioService.createUser(usuarioData).subscribe({
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
          this.usuarioService.updateUser(usuarioData).subscribe({
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
   * Función encargada de validar los criterios de la contraseña
   * @param usuario 
   */
  private validarPassword(validateForm: FormGroup): boolean {
    this.errorPassword = validateForm.get('password')?.value === undefined || validateForm.get('password')?.value.trim() === ''; 
    if(this.idUsuario === undefined) {
      if (!this.validateCriteriaPassword(validateForm.get('password')?.value) || this.errorPassword) {
        return true;
      }
    }    
    return false;
  }

  /**
   * Función encargada de recibir un idUsuario y cargar el usuario completo cuando el usuario esta registrado en la aplicación
   * @param idUsuario 
   * @returns 
   */
  private obtainUserComplet(idUsuario: number): void {
    this.usuarioService.obtainUserDto(idUsuario).subscribe({
      next: response => {
        if (response != null) {
          this.usuario = response;
          this.validateForm.patchValue({
            idUsuario: idUsuario,
            nombreUsuario: this.usuario.nombreUsuario,
            email: this.usuario.email,
            direccion: this.usuario.direccion,
            provincia: this.usuario.provincia,
            municipio: this.usuario.municipio,
            codigoPostal: this.usuario.codigoPostal,
            pais: this.usuario.pais,
            numeroTelefono: this.usuario.numeroTelefono
          });
        }
        // En los formularios Reactivos, el disabled lo hace typescrypt y no en el html
        this.validateForm.get('nombreUsuario')?.disable();
        this.loadProvince();
        this.loadMunicipaliti(this.usuario.provincia);
      }, error: error => {
        throw new error;
      }
    });
  }

  /**
   * Función encargada de validar los requerimientos de la contraseña
   * @param password 
   * @returns 
   */
  validateCriteriaPassword(password: any): boolean {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const idPopoverPassword = document.getElementById('popover-password');
    /*const passwordValue = password.target.value;
    (passwordValue !== undefined && !passwordRegex.test(passwordValue) && passwordValue !== '' )*/
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

  /**
   * Función encargada de cargar los datos necesarios cuando carga la página inicial
   */
  loadProvince(): void {
    this.usuarioService.loadComboInit(true).subscribe({
      next: (response) => {
        this.listaProvincias = response.listaProvincias;
      }, error: (error) => {
        throw new error;
      }
    });
  }

  /**
   * Función encargada de cargar los municipos asociados a una provincia
   * @param event 
   */
    loadMunicipaliti(event: any): void {
      const municipio: string = event.target === undefined ? event :  event.target.value.toString();
      this.usuarioService.loadMunic(municipio).subscribe({
        next: (response) => {
          this.listaMunicipos = response;
        }, error: (error) => {
          throw new error;
        }
      });
    }

    /**
     * Función global para inicializar el formulario reactivo sin datos.
     * @param usuario 
     */
  private initFormReactiveComplet(): void {
    // Inicializamos la validacion de angular con los formularios reactivos
    this.validateForm = this.formBuilder.group({
      idUsuario: [''],
      nombreUsuario: [''],
      email: ['', [Validators.required, Validators.email]],
      direccion: ['', [Validators.required]],
      provincia: ['', [Validators.required]],
      municipio: ['', [Validators.required]],
      codigoPostal: ['', [Validators.required, Validators.pattern('[0-9]{5}$')]],
      pais: ['', [Validators.required]],
      numeroTelefono: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]]
    });
  }

  private initFormReactiveNewUser(): void {
    // Inicializamos la validacion de angular con los formularios reactivos
    this.validateForm = this.formBuilder.group({
      nombreUsuario: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]]
      //password: ['', [Validators.required]]
    });
  }


  private noWhiteSpaceValidator(control: AbstractControl): ValidationErrors | null {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
}

}
