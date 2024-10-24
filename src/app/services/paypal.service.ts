import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { FormularioPaypalRequest } from '../models/formularioPaypalReques';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaypalService {

  url_payment_paypal = environment.hostname_port_local_gtw +  '/api/main/paypal/crear/pago';
  url_confirm_payment_paypal = environment.hostname_port_local_gtw +  '/api/main/paypal/estado/pago';
    
  constructor(private http: HttpClient) { }

  createPayment(paypalRequest: FormularioPaypalRequest): Observable<any> {
    return this.http.post<any>(this.url_payment_paypal, paypalRequest);
  }

  confirmPayment(paymentId: string, payerId: string, idReserva: number) {
    let params = new HttpParams()
    .set('paymentId', paymentId)
    .set('PayerID', payerId)
    .set('idReserva', idReserva);
    return this.http.get<any>(this.url_confirm_payment_paypal, {params});
  }



}
