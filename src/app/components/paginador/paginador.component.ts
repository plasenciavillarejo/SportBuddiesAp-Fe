import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ServicioCompartidoService } from '../../services/servicio-compartido.service';

@Component({
  selector: 'app-paginador',
  standalone: true,
  imports: [],
  templateUrl: './paginador.component.html',
  styleUrl: './paginador.component.css'
})
export class PaginadorComponent implements OnInit {

  @Input() inicio!: boolean;

  @Input() fin!: boolean;

  @Input() paginaActual!: number;

  @Input() totalPaginas!: number;

  @Input() numeroRegistros!: number;

  @Input() tamanioPagina!: number;

  @Output() paginaCambiada = new EventEmitter<number>();

  constructor(private servicioCompartido: ServicioCompartidoService) {

  }

  ngOnInit(): void {
    this.paginator();
    this.paginaCambiada.emit(this.paginaActual); 
  }

  public paginator() {
    console.log(this.inicio);
    console.log(this.fin);
    console.log(this.paginaActual);
    console.log(this.totalPaginas);
    console.log(this.numeroRegistros);
    const intervalos = []
    for (let pagina = 1; pagina <= this.totalPaginas; pagina++) {
      intervalos.push(pagina);
    }

    return intervalos;
  }

  getPageRange(): number[] {
    const inicio = Math.floor((this.paginaActual - 1) / this.tamanioPagina) * this.tamanioPagina + 1;
    const fin = Math.min(inicio + this.tamanioPagina - 1, this.totalPaginas);
  
    const rango = [];
    for (let i = inicio; i <= fin; i++) {
      rango.push(i);
    }
    return rango;
  }

  cambiarPagina(): void {
      // Obtenemos por el emmiter el cambio de pagina
      this.servicioCompartido.numberPageEventEmitter.subscribe(pagina => {
        this.paginaActual = pagina;
      });          
  }
  
}
