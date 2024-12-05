import { Component } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { TokenService } from '../../services/token.service';
import { CrearActividadRequest } from '../../models/crearActividadRequest';
import { FormularioActividadResponse } from '../../models/formularioActividadResponse';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CrearActividadService } from '../../services/crear-actividad.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Paginador } from '../../models/paginador';
import { PaginadorComponent } from '../paginador/paginador.component';
import { ServicioCompartidoService } from '../../services/servicio-compartido.service';

@Component({
  selector: 'app-nueva-actividad',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, PaginadorComponent],
  templateUrl: './nueva-actividad.component.html',
  styleUrl: './nueva-actividad.component.css'
})
export class NuevaActividadComponent {

  listaDeportes: any[] = [];
  listaProvincias: string[] = [];
  listaMunicipos: string[] = [];
  requerimientos: string[] = [''];
  actividadSeleccionada = new Map<number, string>();

  crearActividadRequest: CrearActividadRequest = new CrearActividadRequest();
  formularioActividadResponse: FormularioActividadResponse[] = [];

  validateForm!: FormGroup;
  formSubmit!: boolean;

  requerimientosAdicionales: string[] = [];

  paginador: Paginador = new Paginador();

  constructor(private usuarioService: UsuarioService,
    private tokenService: TokenService,    
    private clientCrearActividad: CrearActividadService,
    private formBuilder: FormBuilder,
    private router: Router,
    private servicioCompartido: ServicioCompartidoService
  ) { }

  ngOnInit(): void {
    this.loadComboInitial();
    this.initFormReactiveActivity();
    this.listReservation(true);
        // Evento encargado de obtener la pagina que se ha pulsado para cambiar el paginador
    this.servicioCompartido.numberPageEventEmitter.subscribe((pagina: number) => {
      this.paginador.paginaActual = pagina;
      this.listReservation(false);
    });
  
  }

  private initFormReactiveActivity(): void {
    this.validateForm = this.formBuilder.group({
      idUsuarioActividadDto: [''],
      fechaReserva: ['', [Validators.required]],
      horaInicio: ['', [Validators.required]],
      horaFin: ['', [Validators.required]],
      actividad: ['', [Validators.required]],       
      usuariosMaxRequeridos: ['', [Validators.required, this.noWhitespaceValidatorNumeric]],
      provincia: ['', [Validators.required]],
      municipio: ['', [Validators.required]],
      codigoPostal: ['', [Validators.required, Validators.pattern('[0-9]{5}$'), this.noWhitespaceValidatorNumeric]],
      direccion: ['', [Validators.required, this.noWhitespaceValidator]],
      urgencia: ['', [Validators.required]],
      abonoPista: ['', [Validators.required, this.decimalValidator, this.noWhitespaceValidatorNumeric]]
    });
  }

  createRequerimientoControl(): FormControl  {
    return this.formBuilder.control('', Validators.required);
  }

   /**
   * Función encargada de cargar los datos necesarios cuando carga la página inicial
   */
   loadComboInitial(): void {
    this.usuarioService.loadComboInit(false).subscribe({
      next: (response) => {
        this.listaDeportes = response.listadoDeportes;
        this.listaProvincias = response.listaProvincias;
      }, error: (error) => {
        console.log(error);
      }
    });
  }

  /**
   * Función encargada de cargar los municipos asociados a una provincia
   * @param event 
   */
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

  /**
   * Funcion encargada de obtener el id y el value de actividad seleccionada en la busqueda para posteriormente cuando se cree la reserva agregarlo directamente
   * @param event 
   */
  checkActivity(event: any): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedOption = selectElement.selectedOptions[0];
    if(this.actividadSeleccionada.size >= 1) {
      this.actividadSeleccionada = new Map<number, string>();
    } 
    this.actividadSeleccionada.set(Number(selectedOption.id), selectedOption.value);
  }

    /**
  * Recibe la posición del input y su valor para agregar al objeto this.requerimientos el valor del requerimiento 
  * @param index 
  * @param value 
  */
  updateRequerimientos(index: number, value: string): void {
    this.requerimientos[index] = value 
  }

  changeInputRequired(index: number, event: any): void {;
    this.requerimientos[index] = event.target.value.toString();
  }

  /**
   * Funcion encargada de agregar un nuevo input vacío dentro de 'requerimientos'
   */
  nuevoRequerimientos(): void {
    this.requerimientos.push('');
  }

  /**
   * Función encargada de recibir el valor del índice el input para eliminar el input
   * @param index 
   */
  removeInput(index: number) {
    if (this.requerimientos.length > 1) {
      this.requerimientos.splice(index, 1); // Elimina el elemento del array
    }
  }

  /**
   * Función encargada de validar el formato para un input del tipo float
   * @param event 
   */
  validarDecimales(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.match(/^\d+(\.\d{0,2})?/)?.[0] || '';
    this.crearActividadRequest.abonoPista = input.value;
  }
/**
   * Función encargada de validar el formato para un input del tipo float
   * @param event 
   */
  validarCodigoPostal(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/\D/g, '').slice(0, 5); // Elimina caracteres no numéricos y limita a 5 dígitos
    this.crearActividadRequest.codigoPostal = parseInt(input.value, 10) || 0;
  }

  /**
   * Función encargada de enviar el formulario para crear un nuevo clientes para el acceso de la apliación
   * @param clienteOauth 
   */
  createActivity(): void {
    this.formSubmit = true;
    
    if(this.validateForm.invalid) {
      return;
    }
    
    // Transformamos el formulario reactivo en un objeto Actividad
    const crearActividad: CrearActividadRequest = this.validateForm.value as CrearActividadRequest;
    
    // Cuando se crea una activida, las plazas restantes son igual a los usuarios maximos requeridos
    crearActividad.plazasRestantes = crearActividad.usuariosMaxRequeridos;
    crearActividad.requerimientos = this.requerimientos;

    crearActividad.idUsuarioActividadDto = this.tokenService.obtainIdUser();
    this.clientCrearActividad.createNewActividad(crearActividad).subscribe({
      next: next => {
          Swal.fire(
            'Actividad Registrada',
            'Se ha registrado exitosamente', 
            'success'
          )
          this.router.navigate(['/'], { replaceUrl: true });
      }, error: error => {
        Swal.fire(
          'Error Actividad',
          error.error.mensaje, 
          'error'
        )
      }
    });
  }


  /**
   * Función de validación personalizada para verificar que el valor no esté vacío y no contenga solo espacios
   * en un input numérico
   * @param control 
   * @returns 
   */
  noWhitespaceValidatorNumeric(control: AbstractControl) {
    const isWhitespace = (control.value || '').toString().trim().length === 0;
    const isValid = !isWhitespace && Number(control.value) > 0;
    return isValid ? null : { whitespaceNumeric: true };
  }

  noWhitespaceValidator(control: AbstractControl) {
    const isWhitespace = (control.value || '').toString().trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }


  /**
   * Función encargada de validar 
   * @returns 
   */
  decimalValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      const isValid = /^\d+(\.\d{1,2})?$/.test(value.toString());
      return isValid ? null : { invalidDecimal: true };
    };
  }

  /**
   * Función encargada de cargar todas las actividades referentes a un usuario
   */
  listReservation(listInitial: boolean): void {
    this.usuarioService.loadReservationListForIdUser(listInitial,this.tokenService.obtainIdUser(),
    this.paginador).subscribe({
      next: (response) => {
        if(response != null){
          this.formularioActividadResponse = response.listActividad;
          this.paginador = response.paginador;
          this.formularioActividadResponse.forEach(res => {
            res.horaInicio = res.horaInicio.split(':').slice(0, 2).join(':');
            res.horaFin = res.horaFin.split(':').slice(0, 2).join(':');
          });
        }
      }, error: (error) => {
        throw new error;
      }
    });
  }

}
