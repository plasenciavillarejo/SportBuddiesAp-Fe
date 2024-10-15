import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ClienteOauthRequest } from '../models/clienteOauthRequest';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteOauthService {

  private url_cliente_oauth = environment.hostname_port_local_oauth +  '/clienteOauth/crear';

  constructor(private http: HttpClient) { }

  createNewClientOauth(clientOauth: ClienteOauthRequest): Observable<any> {
    return this.http.post<any>(this.url_cliente_oauth, clientOauth);
  }
}
