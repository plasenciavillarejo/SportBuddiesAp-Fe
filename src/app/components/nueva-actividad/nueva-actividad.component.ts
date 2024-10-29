import { Component } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { TokenService } from '../../services/token.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PaypalService } from '../../services/paypal.service';
import { ServicioCompartidoService } from '../../services/servicio-compartido.service';
import { CrearActividadRequest } from '../../models/crearActividadRequest';
import { FormularioActividadResponse } from '../../models/formularioActividadResponse';
import { FormsModule } from '@angular/forms';
import { CrearActividadService } from '../../services/crear-actividad.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-nueva-actividad',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './nueva-actividad.component.html',
  styleUrl: './nueva-actividad.component.css'
})
export class NuevaActividadComponent {

  listaDeportes: any[] = [];
  listaProvincias: string[] = [];
  listaMunicipos: string[] = [];
  requerimientos: string[] = [''];
  primeraCarga = false;

  actividadSeleccionada = new Map<number, string>();

  crearActividadRequest: CrearActividadRequest = new CrearActividadRequest();
  formularioActividadResponse: FormularioActividadResponse[] = [];

  constructor(private usuarioService: UsuarioService,
    private tokenService: TokenService,
    private paypalService: PaypalService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private servicioCompartido: ServicioCompartidoService,
    private clientCrearActividad: CrearActividadService
  ) { }

  ngOnInit(): void {
    this.loadComboInitial();
  }
   /**
   * Función encargada de cargar los datos necesarios cuando carga la página inicial
   */
   loadComboInitial(): void {
    this.usuarioService.loadComboInit().subscribe({
      next: (response) => {
        this.listaDeportes = response.listadoDeportes;
        this.listaProvincias = response.listaProvincias;
      }, error: (error) => {
        console.log(error);
      }
    });
  }

  /**
   * Funciçon encargada de cargar los municipos asociados a una provincia
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
    this.requerimientos[index] = value;
  }

  /**
   * Funcion encargada de agregar un nuevo input vacío dentro de 'requerimientos'
   */
  nuevoRequerimientos(): void {
    console.log(this.requerimientos);
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
   * Función encargada de enviar el formulario para crear un nuevo clientes para el acceso de la apliación
   * @param clienteOauth 
   */
  createActivity(crearActividad: CrearActividadRequest): void {
    this.primeraCarga = true;
    this.crearActividadRequest.requerimientos = this.requerimientos;
    this.crearActividadRequest.idUsuarioActividadDto = this.tokenService.obtainIdUser();
    console.log('CLiente recibido: ', crearActividad);
    this.clientCrearActividad.createNewActividad(crearActividad).subscribe({
      next: next => {
          Swal.fire(
            'Cliente CrearActividad',
            'Se ha registrado correctamente la actividad', 
            'success'
          )
      }, error: error => {
        Swal.fire(
          'Cliente CrearActividad',
          'No se ha registrado correctamente la actividad.' + error.error.message, 
          'error'
        )
      }
    });

  }
}
