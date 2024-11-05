import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PagoTarjetaService {

  constructor(private http: HttpClient) { }
}
