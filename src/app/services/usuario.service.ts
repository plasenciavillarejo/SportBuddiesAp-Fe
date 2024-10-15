import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Reserva } from '../models/reserva';
import { environment } from '../../environments/environment';
import { FormularioActividadRequest } from '../models/formularioActividadRequest';
import { InscripcionReservaActividad } from '../models/inscripcionReservaActividad';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  private reserva:  Reserva[] = [];

  url_combo = environment.hostname_port_local + '/api/main/reservaActividad/comboInicio';
  url_municipalities = environment.hostname_port_local + '/api/main/reservaActividad/listadoMunicipios';
  url_listing_reservation = environment.hostname_port_local + '/api/main/reservaActividad/listadoReserva';
  url_registration_reservation = environment.hostname_port_local + '/api/main/reservaActividad/inscripcion';
  url_validate_activity = environment.hostname_port_local + '/api/main/reservaActividad/validarActividad/';

  constructor(private http: HttpClient) { }

  loadComboInit(): Observable<any>  {
    return this.http.get<any>(this.url_combo);
  }

  loadMunic(municipio: string): Observable<any> {
    const params = new HttpParams().set('municipio', municipio);
    return this.http.get<any>(this.url_municipalities, {params});
  }

  loadReservationList(formularioActividad: FormularioActividadRequest) : Observable<any> {
    return this.http.post<any>(this.url_listing_reservation, formularioActividad);
  }

  registrationReservation(inscripcionReserva: InscripcionReservaActividad): Observable<any>{
    return this.http.post<any>(this.url_registration_reservation, inscripcionReserva);
  }

  listActivityRegistered(idUsuario: number) : Observable<any> {
    return this.http.get<any>(this.url_validate_activity + idUsuario);
  }

}
