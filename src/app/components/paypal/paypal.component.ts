import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormularioPaypalRequest } from '../../models/formularioPaypalReques';
import { PaypalService } from '../../services/paypal.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-paypal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './paypal.component.html',
  styleUrl: './paypal.component.css'
})
export class PaypalComponent implements OnInit {


  paypalRequest: FormularioPaypalRequest = new FormularioPaypalRequest();

  constructor(private paypalService: PaypalService) {
    this.paypalRequest.metodo = 'Paypal'; // Inicializamos el string con el valor por defecto Paypal  
  }

  ngOnInit(): void {

  }

  createPayment(formularioPaypal: FormularioPaypalRequest) {
    this.paypalService.createPayment(formularioPaypal).subscribe({
      next: response => {
        const approvalUrl = response.approval_url; // Cambiamos la búsqueda de la URL
        
        if (approvalUrl) {
          // Redirige al usuario a PayPal para que apruebe el pago
          window.location.href = approvalUrl;
        } else {
          console.error('No se encontró la URL de aprobación de PayPal.');
        }
      },
      error: error => {
        console.error("Error al crear el pago con PayPal:", error);
      }
    });
  }

}
