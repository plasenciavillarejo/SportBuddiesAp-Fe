import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario';
import { map, Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Reserva } from '../models/reserva';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private urlEndpointPrueba = "http://localhost:8090/api/main/listarReserva?fechaReserva=2024-09-13&idUsuReserva=1"

  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  private reserva:  Reserva[] = [];

  private usuario: Usuario[] = [
    {
      idUsuario: 1,    
      nombre: 'Jose',
      apellido: 'Plasencia',
      email: 'le@gmail.com',
      rol: [
          {
              idRol: 1,
              nombreRol: 'ADMIN'
          },
      ]},
      {
        idUsuario: 2,    
        nombre: 'Maria',
        apellido: 'Plasencia',
        email: 'le@gmail.com',
        rol: [
            {
                idRol: 1,
                nombreRol: 'ADMIN'
            },
            {
                idRol: 2,
                nombreRol: 'USER'
            }   
        ]}
  ]

  constructor(private http: HttpClient) { }

  getReservas(): Observable<Reserva[]> {
    // of convierte un arreglo en un flujo de stream() de tipo asíncrono
    return this.http.get<Reserva[]>(this.urlEndpointPrueba).pipe(
      map(data => data as Reserva[])
    );
    //return of(this.usuario);
  }

 


}
