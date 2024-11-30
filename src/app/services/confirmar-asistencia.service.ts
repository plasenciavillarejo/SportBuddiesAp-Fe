import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfirmarAsistenciaRequest } from '../models/confirmarAsistenciaRequest';
import { ConfirmarAsistenciaResponse } from '../models/confirmarAsistenciaResponse';


@Injectable({
  providedIn: 'root'
})
export class ConfirmarAsistenciaService {

  private url_cliente_confirm_asist = environment.hostname_port_local_gtw +  '/api/main/confirmar-asistencia/usuarios';
  private url_save_cliente_confirm_asist = environment.hostname_port_local_gtw +  '/api/main/confirmar-asistencia/guardar';
  private url_list_cliente_confirm_asist = environment.hostname_port_local_gtw +  '/api/main/confirmar-asistencia/listadoIdConfirmados/';

  constructor(private http: HttpClient) { }

  listConfirmation(confirmarAsistenciaRequest: ConfirmarAsistenciaRequest): Observable<any> {
    const params = new HttpParams()
    .set('idUsuario', confirmarAsistenciaRequest.idUsuario)
    .set('caracteristicasPaginacion.pagina',confirmarAsistenciaRequest.caracteristicasPaginacion.pagina)
    .set('caracteristicasPaginacion.tamanioPagina',confirmarAsistenciaRequest.caracteristicasPaginacion.tamanioPagina)
    .set('caracteristicasPaginacion.campoOrden',confirmarAsistenciaRequest.caracteristicasPaginacion.campoOrden)
    .set('caracteristicasPaginacion.orden',confirmarAsistenciaRequest.caracteristicasPaginacion.orden);
    return this.http.get<any>(this.url_cliente_confirm_asist, {params});
  }

  saveUserConfirm(confirmarAsistenciaResponse: ConfirmarAsistenciaResponse): Observable<any> {
    return this.http.post<any>(this.url_save_cliente_confirm_asist, confirmarAsistenciaResponse);
  }

  obtainListIdUserConfirm(idUsuario: number) : Observable<any> {
    return this.http.get<any>(this.url_list_cliente_confirm_asist + idUsuario);
  }

}
