import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TokenService } from '../../services/token.service';
import { CookieService } from 'ngx-cookie-service';
import * as CryptoJS from 'crypto-js';

const CHARACTERS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

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
  }

  constructor(private tokenService: TokenService,
    private http: HttpClient, private cookieService : CookieService
  ) {}

  ngOnInit(): void {
    
  }

  async onLogin() {
    // Generamos el token
    const code_verifier = this.generateCodeVerify();
    // Lo almacenamos en el locaStorage
    this.tokenService.setVerifier(code_verifier);
    // Agregamos en los parámetros el code_verifier que hemos generado anteriormente
    this.generateCodeChallenge(code_verifier).then(code_challenge => {
      this.params.code_challenge = code_challenge;
      const httpParams = new HttpParams({ fromObject: this.params });
      const codeUrl = this.authorize_uri + httpParams.toString();
      
      // Redirigir
      location.href = codeUrl;
    }).catch(error => {
      console.error('Error generating code challenge', error);
    });
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

  /*Función encargada de generar el Verifie para poder enviarlo en la autenticación */
  generateCodeVerify(): string{
    let resultCode = '';
    // Para generar el código debemos de crearnos una constante que contenga 44 carácteres.
    const tamanioConst = CHARACTERS.length;
    for(let i=0; i < 44; i++) {
      resultCode += CHARACTERS.charAt(Math.floor(Math.random() * tamanioConst));
    }
    return resultCode;
  }

  /**
   * FUnción encargada de cifrar el Code Verifier*/
  async generateCodeChallenge(codeVerifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    // Usar Web Crypto API para generar el hash SHA-256
    const hash = await crypto.subtle.digest('SHA-256', data);
    // Convertir el hash a base64-url
    const base64String = this.arrayBufferToBase64Url(hash);
    return base64String;
  }

  /**
   * Función auxiliar para convertir ArrayBuffer en Base64-url
   */
  arrayBufferToBase64Url(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (const byte of bytes) {
      binary += String.fromCharCode(byte);
    }
    const base64String = btoa(binary);
    return base64String
      .replace(/\+/g, '-') // Sustituir "+" por "-"
      .replace(/\//g, '_') // Sustituir "/" por "_"
      .replace(/=+$/, ''); // Eliminar "=" al final
  }

}
