import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-authorize',
  standalone: true,
  imports: [],
  templateUrl: './authorize.component.html'
})
export class AuthorizeComponent implements OnInit {

  code = '';

  constructor(private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router
  ){}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(data => {
      this.code = data['code'];
      this.getToken();
    });
  }

  getToken():void {
    this.authService.getToken(this.code).subscribe({
      next: response => {
        console.log(response);
        this.tokenService.setToken(response.access_token, response.refresh_token);
        // Una vez que obtenemos el token, nos redirige a la pagina inicial por defecto
        this.router.navigate(['']);
      }, error: error => {
        console.log(error);
      }
    });
  }

}
