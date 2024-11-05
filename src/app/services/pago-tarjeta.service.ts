import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PagoTarjetaRequest } from '../models/pagoTarjetaRequest';

@Injectable({
  providedIn: 'root'
})
export class PagoTarjetaService {

  private url_payment = environment.hostname_port_local_gtw + '/api/main/tarjeta/realizar/pago';

  constructor(private http: HttpClient) { }

  /**
   * Función encargada de realizar el pago con tarjeta en stripe 
   * @param pagoTarjetaRequest 
   * @returns 
   */
  paymentCard(pagoTarjetaRequest: PagoTarjetaRequest): Observable<any> {
    return this.http.post<any>(this.url_payment, pagoTarjetaRequest);
  }

}
