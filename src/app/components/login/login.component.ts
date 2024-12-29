import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../../models/usuario';
import Swal from'sweetalert2';
import { HttpParams } from '@angular/common/http';
import { TokenService } from '../../services/token.service';
import { environment } from '../../../environments/environment';

const CHARACTERS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html'
})

export class LoginComponent {
  
  usuario: Usuario = new Usuario();;

  authorize_uri = environment.authorize_uri;

  params: any = {
    client_id: environment.client_id,
    redirect_uri: environment.redirect_uri,
    scope: environment.scope,
    response_type: environment.response_type,
    response_mode: environment.response_mode,
    code_challenge_method: environment.code_challenge_method,
  }

  constructor(private tokenService: TokenService,) 
  {}

  ngOnInit(): void {
    //this.onLogin();
  }

  // Cuando enviemos el usuario que vamos hacer con el
  validacionCredenciales() {
    if(!this.usuario.email || !this.usuario.password) {
      Swal.fire(
        'Error de validación',
        'Usuario y Password requeridos',
        'error'
      )
    } 
  }

  /* Al utilizar la API Web Crypto al ser asíncrono tenemos que convertir el login de forma asíncrona, de lo contrario cuando se intente 
    obtener el code_challenge saltará al login pero no tendremos el code_challange generado, por tanto al validarlo con el code_verifier,
     ouath 2 nos dara invalid_grant */
     async onLogin() {
      // Generamos el token
      const code_verifier = this.generateCodeVerify();
      // Lo almacenamos en el locaStorage
      this.tokenService.setVerifier(code_verifier);
      // Agregamos en los parámetros el code_verifier que hemos generado anteriormente
      this.generateCodeChallenge(code_verifier).then( code_challenge => {
        this.params.code_challenge = code_challenge;
        const httpParams = new HttpParams({ fromObject: this.params });
        const codeUrl = this.authorize_uri + httpParams.toString();

      }).catch(error => {
        console.error('Error generating code challenge', error);
      });
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
