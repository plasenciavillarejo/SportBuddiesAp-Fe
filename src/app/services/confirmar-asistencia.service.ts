import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfirmarAsistenciaService {

  private url_cliente_confirm_asist = environment.hostname_port_local_gtw +  '/api/main/confirmar-asistencia/usuarios/';

  constructor(private http: HttpClient) { }

  listConfirmation(idUsuario: number): Observable<any> {
    return this.http.get<any>(this.url_cliente_confirm_asist + idUsuario);
  }

}
