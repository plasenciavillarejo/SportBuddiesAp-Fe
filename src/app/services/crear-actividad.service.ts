import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { CrearActividadRequest } from '../models/crearActividadRequest';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CrearActividadService {

  private url_cliente_crear_actividad = environment.hostname_port_local_gtw +  '/api/main/reservaActividad/crear';

  constructor(private http: HttpClient) { }

  createNewActividad(crearActividad: CrearActividadRequest): Observable<any> {
    return this.http.post<any>(this.url_cliente_crear_actividad, crearActividad);
  }
}
