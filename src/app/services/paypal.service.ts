import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { FormularioPaypalRequest } from '../models/formularioPaypalReques';

@Injectable({
  providedIn: 'root'
})
export class PaypalService {

  private url_payment_paypal = environment.hostname_port_local_gtw +  '/api/main/paypal/crear/pago';
  private url_confirm_payment_paypal = environment.hostname_port_local_gtw +  '/api/main/paypal/estado/pago';

  constructor(private http: HttpClient) { }

  createPayment(paypalRequest: FormularioPaypalRequest) {
    return this.http.post<any>(this.url_payment_paypal, paypalRequest);
  }

  confirmPayment(paymentId: string, payerId: string) {
    let params = new HttpParams()
    .set('paymentId', paymentId)
    .set('PayerID', payerId);
    return this.http.get<any>(this.url_confirm_payment_paypal, {params});
  }

}
