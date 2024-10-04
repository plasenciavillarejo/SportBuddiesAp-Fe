import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TokenService } from '../../services/token.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  authorize_uri = environment.authorize_uri;
  logout_url = environment.logout_url;

  isAuthenticate!: boolean;
  isAdmin!: boolean;
  isUser!: boolean;

  params: any = {
    client_id: environment.client_id,
    redirect_uri: environment.redirect_uri,
    scope: environment.scope,
    response_type: environment.response_type,
    response_mode: environment.response_mode,
    code_challenge_method: environment.code_challenge_method,
    code_challenge: environment.code_challenge,
  }

  constructor(private tokenService: TokenService,
    private http: HttpClient, private cookieService : CookieService
  ) {}

  ngOnInit(): void {
    
  }

  onLogin() {
    const httpParams = new HttpParams({fromObject: this.params});
    const codeUrl = this.authorize_uri + httpParams.toString();
    // Esto me va redirigirar a http://localhost:4200/authorize ya que está indicada la redirección en Oauth2
    location.href = codeUrl;
  }

  onLogout():void {    
    this.http.get('http://localhost:8090/cerrarSesion',{ withCredentials: true }).subscribe({
      next: response => {
        this.tokenService.clearToken();
        console.log('Sesión cerrada con éxito');
        location.href = 'http://localhost:4200'; // Redirigir al login o página principal
      },
      error: error => {
        console.error('Error al cerrar sesión:', error);
      }
    });
  }

  getLogged():void {
    this.isAuthenticate = this.tokenService.isAuthenticate();
    this.isAdmin = this.tokenService.isRoleAdmin();
    this.isUser = this.tokenService.isRoleUser();
  }

}
