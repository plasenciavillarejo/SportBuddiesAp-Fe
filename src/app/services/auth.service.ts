import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token_url = environment.token_url;

  constructor(private http: HttpClient
  ) { }

  getToken(code: string): Observable<any> {
    let body = new URLSearchParams();
    body.set('grant_type', environment.grant_type);
    body.set('client_id', environment.client_id);
    body.set('redirect_uri', environment.redirect_uri);
    body.set('scope', environment.scope);
    body.set('code_verifier', environment.code_verifier);
    body.set('code', code);

    const basic_auth = 'Basic '+ btoa('client-angular:12345')

    const headers_objects = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': '*/*',
      'Authorization': basic_auth
    });

    const httpOptions = { headers: headers_objects };

    return this.http.post<any>(this.token_url, body, httpOptions );
  }


  loginUser({email, password}: any): Observable<any> {    
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'});

    // Crear los datos en formato x-www-form-urlencoded
    const body = new HttpParams()
    .set('username', email)
    .set('password', password);
    
    // Retornamos el observable que hace las llamadas iniciales y luego el login
    return this.http.post<any>('', body.toString(), { headers });
  }

}
