import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RouterEvent, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { LayoutComponent } from './components/layout/layout.component';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  // Importamos los componentes "Login"
  imports: [HeaderComponent, RouterOutlet, LayoutComponent],
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


