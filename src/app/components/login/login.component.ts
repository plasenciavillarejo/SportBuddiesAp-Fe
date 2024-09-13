import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent} from '../header/header.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterOutlet,HeaderComponent],
  templateUrl: './login.component.html'
})

export class LoginComponent {

}
