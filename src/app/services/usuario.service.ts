import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario';
import { usuarioData } from '../data/usuario.data';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private usuario: Usuario = usuarioData;

  constructor() { }

  getUsuario(): Usuario {
    return this.usuario;
  }


}
