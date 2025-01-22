import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { TokenService } from './token.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token_url = environment.token_url;
  // Con la VPS HTTPS al borrar la cookie funciona la siguiente.
  private url_logout = environment.hostname_port_local_gtw + '/api/main/borrarCookie';
  private url_clear_cookie = environment.hostname_port_local_gtw + '/api/main/borrarCookie';
  /**
   * Estos endpoints tiene que apuntar directamente al proyecto OAUTH2 ya que si pasar por el GATEWAY habrá problemas de CORS
   */
  private url_passkey_register = environment.hostname_port_local_oauth + '/passkeys/register';
  private url_passkey_validate = environment.hostname_port_local_oauth + '/passkeys/validar-registro';
  private url_passkey_challenge_be = environment.hostname_port_local_oauth + '/passkeys/generate-challenge';
  private url_passkey_login = environment.hostname_port_local_oauth + '/passkeys/login';
  private url_login = environment.hostname_port_local_oauth + '/login';

  constructor(private http: HttpClient,
    private tokenService: TokenService,
    private router: Router,
  ) { }

  getToken(code: string, code_verifier: string): Observable<any> {
    let body = new URLSearchParams();
    body.set('grant_type', environment.grant_type);
    body.set('client_id', environment.client_id);
    body.set('redirect_uri', environment.redirect_uri);
    body.set('scope', environment.scope);
    body.set('code_verifier', code_verifier);
    body.set('code', code);
    // PLASENCIA - CORREGIR FUNCIONAMIENTO - EL CLIENTE ID Y SU PASSWORD TIENE QUE OBTENERSE MEDIANTE UNA LLAMADA AL BE POR SU ID
    const basic_auth = 'Basic ' + btoa('client-angular:12345')

    const headers_objects = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': '*/*',
      'Authorization': basic_auth
    });

    const httpOptions = { headers: headers_objects };

    return this.http.post<any>(this.token_url, body, httpOptions);
  }

  logout() {
    this.http.get(this.url_logout, { withCredentials: true }).subscribe({
      next: response => {
        this.tokenService.clearToken();
        console.log('Sesión cerrada con éxito');
        location.href = environment.hostname_port_local_fe; // Redirigir al login o página principal
      },
      error: error => {
        this.tokenService.clearToken();
        this.router.navigate(['']);
      }
    });
  }
  /**
   * Función encargada de llamar al BE para borrar las cookies y no se quede almacenado el JSSESIONID para poder loguearse nuevamente con otro usuario
   */
  clearTokenWithCookie(): Promise<void> {
    this.tokenService.clearToken();
    return new Promise((resolve, reject) => {
      this.http.get(this.url_clear_cookie, { withCredentials: true }).subscribe({
        next: response => {
          console.log('Sesión cerrada con éxito');
          location.href = environment.hostname_port_local_fe;
          resolve(); // Llamar a resolve cuando se complete la solicitud
        },
        error: error => {
          console.error('Error al cerrar sesión:', error);
          reject(error); // Llamar a reject en caso de error
        }
      });
    });
  }

  loginCorbadoPassKey(username: string): Observable<any> {
    let body = new URLSearchParams();
    body.set('username', username);
    return this.http.post<any>(this.url_login, body);
  }

  passkeyRegister(username: string): Observable<any> {
    const body = {
      username: username,
      displayName: username,
      // Nombre con el que se generara el nombre del registro
      rpId: environment.rpid_passkey,
      origin: environment.hostname_port_local_oauth
    };
    return this.http.post<any>(this.url_passkey_register, body);
  }

  validateCredential(credential: any): Observable<String> {
    return this.http.post<any>(this.url_passkey_validate, credential)
  }

  obtainGenerteChallengeBe(): Observable<any> {
    return this.http.get<any>(this.url_passkey_challenge_be);
  }

  loginPassKeys(credentialPasskeyNavigation: any) : Observable<any> {
    return this.http.post<any>(this.url_passkey_login, credentialPasskeyNavigation);
  }

  obtainCode()  : Observable<any> {
   const body = new URLSearchParams();
    body.set('username', 'jose');
    body.set('password', '12345');

    // Configurar las cabeceras
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    // Enviar la solicitud POST
    return this.http.post('http://localhost:9000/login', body.toString(), { headers });

  }

}
