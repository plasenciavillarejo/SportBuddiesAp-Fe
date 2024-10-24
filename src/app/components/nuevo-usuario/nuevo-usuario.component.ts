import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nuevo-usuario',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './nuevo-usuario.component.html',
  styleUrl: './nuevo-usuario.component.css'
})
export class NuevoUsuarioComponent implements OnInit {

  usuario: Usuario = new Usuario();
  
  constructor(private usuarioServicio: UsuarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    
  }

  createNewUser(usuario: Usuario) {
    this.usuarioServicio.createUser(usuario).subscribe({
      next: response => {
        Swal.fire(
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
  }


}
