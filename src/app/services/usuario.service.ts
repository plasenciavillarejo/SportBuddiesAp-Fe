import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario';
import { map, Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Reserva } from '../models/reserva';
import { provincia } from '../models/provincia';
import { environment } from '../../environments/environment';
import { FormularioActividadRequest } from '../models/formularioActividadRequest';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  private reserva:  Reserva[] = [];

  url_combo = environment.hostname_port_local + '/api/main/reservaActividad/comboInicio';
  url_municipios = environment.hostname_port_local + '/api/main/reservaActividad/listadoMunicipios';
  url_listado_reserva = environment.hostname_port_local + '/api/main/reservaActividad/listadoReserva';

  constructor(private http: HttpClient) { }

  loadComboInit(): Observable<any>  {
    return this.http.get<any>(this.url_combo);
  }

  loadMunic(municipio: string): Observable<any> {
    const params = new HttpParams().set('municipio', municipio);
    return this.http.get<any>(this.url_municipios, {params});
  }

  loadReservationList(formularioActividad: FormularioActividadRequest) : Observable<any> {
    return this.http.post<any>(this.url_listado_reserva, formularioActividad);
  }



}
