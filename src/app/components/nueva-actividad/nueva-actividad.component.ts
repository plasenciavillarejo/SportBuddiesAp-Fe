import { Component } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { TokenService } from '../../services/token.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PaypalService } from '../../services/paypal.service';
import { ServicioCompartidoService } from '../../services/servicio-compartido.service';
import { FormularioActividadResponse } from '../../models/formularioActividadResponse';
import { FormsModule } from '@angular/forms';

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

  actividadSeleccionada = new Map<number, string>();

  formularioActividadResponse: FormularioActividadResponse[] = [];

  constructor(private usuarioService: UsuarioService,
    private tokenService: TokenService,
    private paypalService: PaypalService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private servicioCompartido: ServicioCompartidoService
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
  checkActivity(event: any) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedOption = selectElement.selectedOptions[0];
    if(this.actividadSeleccionada.size >= 1) {
      this.actividadSeleccionada = new Map<number, string>();
    } 
    this.actividadSeleccionada.set(Number(selectedOption.id), selectedOption.value);
  }


}
