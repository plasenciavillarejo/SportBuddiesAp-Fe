import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './paginas/login/login.component';

@Component({
  selector: 'app-root',
  standalone: true,
  // Importamos los componentes "Login"
  imports: [LoginComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'SportBuddiesApp-Fe';
}
