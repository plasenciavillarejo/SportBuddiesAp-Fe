import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent                                                                                                                                            ],
  templateUrl: './login.component.html'
})

export class LoginComponent {

}
