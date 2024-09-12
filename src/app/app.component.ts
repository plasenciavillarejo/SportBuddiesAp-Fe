import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UsuariosComponent } from './paginas/usuarios/usuarios.component';

@Component({
  selector: 'app-root',
  standalone: true,
  // Importamos los componentes "Login"
  imports: [UsuariosComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'SportBuddiesApp-Fe';
}
