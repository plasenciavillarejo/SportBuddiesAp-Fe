import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario';
import { map, Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Reserva } from '../models/reserva';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private urlEndpointPrueba = "http://localhost:8090/api/main/reserva/listarReserva?fechaReserva="

  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  private reserva:  Reserva[] = [];

  constructor(private http: HttpClient) { }

  getReservas(fechaSeleccionada: string): Observable<Reserva[]> {
    // of convierte un arreglo en un flujo de stream() de tipo asíncrono
    return this.http.get<Reserva[]>(this.urlEndpointPrueba + fechaSeleccionada + '&idUsuReserva=3').pipe(
      map(data => data as Reserva[])
    );
    //return of(this.usuario);
  }

 


}
