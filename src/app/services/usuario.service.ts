import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { InscripcionReservaActividad } from '../models/inscripcionReservaActividad';
import { Usuario } from '../models/usuario';
import { BusquedaActividadRequest } from '../models/busquedaActividadRequest';
import { Paginador } from '../models/paginador';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private url_combo = environment.hostname_port_local_gtw + '/api/main/reservaActividad/comboInicio';
  private url_municipalities = environment.hostname_port_local_gtw + '/api/main/reservaActividad/listadoMunicipios';
  private url_listing_reservation = environment.hostname_port_local_gtw + '/api/main/reservaActividad/listadoReserva';
  private url_registration_reservation = environment.hostname_port_local_gtw + '/api/main/reservaActividad/inscripcion';
  private url_validate_activity = environment.hostname_port_local_gtw + '/api/main/reservaActividad/validarActividad/';
  private url_delete_activity = environment.hostname_port_local_gtw + '/api/main/reservaUsuario/eliminar/';
  private url_crete_user = environment.hostname_port_local_gtw + "/api/main/usuario/crear"
  private url_user_dto = environment.hostname_port_local_gtw + "/api/main/usuario/buscarUsuarioId"
  private url_update_user = environment.hostname_port_local_gtw + "/api/main/usuario/actualizar"

  constructor(private http: HttpClient) { }

  loadComboInit(provinc: boolean): Observable<any>  {
    const params = new HttpParams().set('provincias', provinc);
    return this.http.get<any>(this.url_combo, {params});
  }

  loadMunic(municipio: string): Observable<any> {
    const params = new HttpParams().set('municipio', municipio);
    return this.http.get<any>(this.url_municipalities, {params});
  }

  loadReservationList(formularioActividad: BusquedaActividadRequest) : Observable<any> {
    const fechaReservaString = formularioActividad.fechaReserva 
    ? new Date(formularioActividad.fechaReserva).toISOString().split('T')[0]  // 'YYYY-MM-DD' format
    : '';
    const params = new HttpParams()
    .set('fechaReserva', fechaReservaString)
    .set('actividad', formularioActividad.actividad)
    .set('provincia', formularioActividad.provincia)
    .set('municipio', formularioActividad.municipio)
    .set('idUsuario',formularioActividad.idUsuario)
    .set('caracteristicasPaginacion.pagina',formularioActividad.caracteristicasPaginacion.pagina)
    .set('caracteristicasPaginacion.tamanioPagina',formularioActividad.caracteristicasPaginacion.tamanioPagina)
    .set('caracteristicasPaginacion.campoOrden',formularioActividad.caracteristicasPaginacion.campoOrden)
    .set('caracteristicasPaginacion.orden',formularioActividad.caracteristicasPaginacion.orden)
    .set('paginaInicio',formularioActividad.paginaInicio ? formularioActividad.paginaInicio : false);
    return this.http.get<any>(this.url_listing_reservation, {params});
  }

  registrationReservation(inscripcionReserva: InscripcionReservaActividad): Observable<any>{
    return this.http.post<any>(this.url_registration_reservation, inscripcionReserva);
  }

  listActivityRegistered(idUsuario: number): Observable<number []> {
    return this.http.get<any>(this.url_validate_activity + idUsuario);
  }

  deleteActivityRegistered(idReservaUsuario: number, idUsuario: number): Observable<any>  {
    return this.http.delete<any>(this.url_delete_activity + idReservaUsuario + "/" + idUsuario);
  }

  createUser(usuario: Usuario): Observable<void> {
    return this.http.post<void>(this.url_crete_user, usuario);
  }

  obtainUserDto(idUsuario: number): Observable<any> {
    const params = new HttpParams().set('idUsuario', idUsuario);
    return this.http.get<any>(this.url_user_dto, {params});
  }

  updateUser(usuario: Usuario): Observable<any> {
    return this.http.post<void>(this.url_update_user, usuario);
  }

  loadReservationListForIdUser(listInitial: boolean, idUsuario: number,
    paginador: Paginador
  ): Observable<any>  {
    const params = new HttpParams()
    .set('idUsuario', idUsuario)
    .set('caracteristicasPaginacion.pagina', listInitial ? 1 : paginador.paginaActual)
    .set('caracteristicasPaginacion.tamanioPagina', 5)
    .set('caracteristicasPaginacion.campoOrden', 'horaInicio')
    .set('caracteristicasPaginacion.orden', 1)
    .set('paginaInicio', false);
    return this.http.get<any>(this.url_listing_reservation, {params});
  }
}
