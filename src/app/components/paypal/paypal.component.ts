import { Component, OnInit } from '@angular/core';
import { FormularioPaypalRequest } from '../../models/formularioPaypalReques';
import { PaypalService } from '../../services/paypal.service';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { ServicioCompartidoService } from '../../services/servicio-compartido.service';

@Component({
  selector: 'app-paypal',
  standalone: true,
  imports: [FormsModule, RouterOutlet],
  templateUrl: './paypal.component.html',
  styleUrl: './paypal.component.css'
})
export class PaypalComponent implements OnInit {

  paypalRequest: FormularioPaypalRequest = new FormularioPaypalRequest();

  idReserva!: number;

  constructor(private paypalService: PaypalService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private servicioCompartido: ServicioCompartidoService
  ) {
    this.paypalRequest.metodo = 'Paypal'; // Inicializamos el string con el valor por defecto Paypal  
  }

  ngOnInit(): void {
    // Capturamos el idReserva que se envía en la URL
    this.activatedRoute.params.subscribe(params => {
      this.idReserva = params['id'];
      // Agregamos el idReserva al servicio compartido
      if(this.idReserva) {
        localStorage.setItem("id", String(this.idReserva));
      }      
    });
  }

  createPayment(formularioPaypal: FormularioPaypalRequest) {
    this.idReserva = formularioPaypal.idReserva;
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
