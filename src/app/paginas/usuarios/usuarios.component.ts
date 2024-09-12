import { Component } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [],
  templateUrl: './usuarios.component.html'
})
export class UsuariosComponent {

  usuario!: Usuario;

  constructor(private service: UsuarioService) {}

  ngOnInit(): void {
    this.usuario = this.service.getUsuario();
  }

}
