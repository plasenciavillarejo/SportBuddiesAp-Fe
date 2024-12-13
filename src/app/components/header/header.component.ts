import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';
import { HttpParams } from '@angular/common/http';
import { TokenService } from '../../services/token.service';
import { ServicioCompartidoService } from '../../services/servicio-compartido.service';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
declare var bootstrap: any
const CHARACTERS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  url_logout = environment.hostname_port_local_gtw +'/cerrarSesion';

  authorize_uri = environment.authorize_uri;
  logout_url = environment.logout_url;

  isAuthenticate!: boolean;
  isAdmin!: boolean;
  isUser!: boolean;

  isSesionInit!: boolean;

  params: any = {
    client_id: environment.client_id,
    redirect_uri: environment.redirect_uri,
    scope: environment.scope,
    response_type: environment.response_type,
    response_mode: environment.response_mode,
    code_challenge_method: environment.code_challenge_method,
  }

  idUsuario!: number;

  constructor(private tokenService: TokenService,
    private servicioCompartido: ServicioCompartidoService,
    private authService : AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router
    ) {}

  ngOnInit(): void {
    this.initSesionEmit();
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
      
      // Redirigir
      location.href = codeUrl;
    }).catch(error => {
      console.error('Error generating code challenge', error);
    });
  }

  /**
   * Función para cerrar sesión
   */
  onLogout():void {    
    this.authService.logout();
  }

  /**
   * Función encargada de asinar los permisos de cada rol
   */
  getLogged():void {
    this.isAuthenticate = this.tokenService.isAuthenticate();
    this.isAdmin = this.tokenService.isRoleAdmin();
    this.isUser = this.tokenService.isRoleUser();
  }

  /**
   * Función encargada de generar el Verifie para poder enviarlo en la autenticación
   * @returns 
   */
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
   * FUnción encargada de cifrar el Code Verifier
   * @param codeVerifier 
   * @returns 
   */
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
   * @param buffer 
   * @returns 
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

  /**
   * Función encargada de retornar el nombrel de usuario logueado en la aplicación
   * @returns 
   */
  obtainNameUser(): string {
    return this.tokenService.obtainNameUser();
  }

  admin(): boolean {
    return this.tokenService.isRoleAdmin();
  }

  /**
   * Función que se subcribe al servicio compartido para validar si el usuario ha iniciado sesion y pasados 2 segundos desaparecerá
   * 
   */
  initSesionEmit() {
    this.servicioCompartido.initSessionEventEmitter.subscribe((initSesion: boolean) => {
      this.isSesionInit = initSesion;
      if(this.isSesionInit) {
        setTimeout( () => {
          this.isSesionInit = false;
        },2000);
      }
    })
  }

  /**
   * Devuelve el id del usuario de forma asícrona una vez que el usuario ha sido registrado
   * @returns 
   */
  idUser(): Observable<number> {
    return this.servicioCompartido.obtainIdUserGenericObservable();
  }

}
