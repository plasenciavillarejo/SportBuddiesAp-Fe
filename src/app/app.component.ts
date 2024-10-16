import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RouterEvent, RouterOutlet } from '@angular/router';

import { HeaderComponent } from './components/header/header.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { LoginComponent } from './components/login/login.component';
import { LayoutComponent } from './components/layout/layout.component';
import { filter } from 'rxjs';
import { MisReservasComponent } from './components/mis-reservas/mis-reservas.component';
import { HistorialReservasComponent } from './components/historial-reservas/historial-reservas.component';

@Component({
  selector: 'app-root',
  standalone: true,
  // Importamos los componentes "Login"
  imports: [UsuariosComponent,LoginComponent,HeaderComponent, RouterOutlet, LayoutComponent,MisReservasComponent, HistorialReservasComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'SportBuddiesApp-Fe';

  constructor(private router: Router) {}

  // Cada vez que haya una navegación entre página para verificar si estoy logueado en ella llamaremos 

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event: any) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.cabecera.getLogged();
      });
  }
  
  @ViewChild('cabecera') cabecera!: HeaderComponent;

}


