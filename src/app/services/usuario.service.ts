import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

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

  constructor() { }

  getUsuario(): Observable<Usuario[]> {
    // of convierte un arreglo en un flujo de stream() de tipo asíncrono
    return of(this.usuario);
  }

 


}
