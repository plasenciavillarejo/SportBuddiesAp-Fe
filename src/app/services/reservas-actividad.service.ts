import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReservasActividadService implements OnInit {


  constructor(private http: HttpClient) { }

  ngOnInit(): void {

  }


 



}