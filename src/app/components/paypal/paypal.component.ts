import { Component, OnInit } from '@angular/core';
import { FormularioPaypalRequest } from '../../models/formularioPaypalReques';
import { PaypalService } from '../../services/paypal.service';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { ServicioCompartidoService } from '../../services/servicio-compartido.service';
import { ReservasService } from '../../services/reservas.service';
import { map, Observable } from 'rxjs';
import { SpinnerModalComponent } from '../spinner-modal/spinner-modal.component';

@Component({
  selector: 'app-paypal',
  standalone: true,
  imports: [FormsModule, RouterOutlet, SpinnerModalComponent],
  templateUrl: './paypal.component.html',
  styleUrl: './paypal.component.css'
})
export class PaypalComponent implements OnInit {

  paypalRequest: FormularioPaypalRequest = new FormularioPaypalRequest();

  idReserva!: number;

  constructor(private paypalService: PaypalService,
    private activatedRoute: ActivatedRoute,
    private reservaUsuario: ReservasService,
    private servicioCompartido: ServicioCompartidoService
  ) {
    this.paypalRequest.metodo = 'Paypal'; // Inicializamos el string con el valor por defecto Paypal  
  }

  ngOnInit(): void {
    
    // Capturamos el idReservaUsuario que se envía en la URL
    this.activatedRoute.params.subscribe(params => {
      this.idReserva = params['id'];
      // Agregamos el idReserva al servicio compartido
      if(this.idReserva) {
        localStorage.setItem("id", String(this.idReserva));
      }      
    });

    /* Con el idReservaUsuario rellenamos el formulario necesario para los datos en paypal y hacermos la cosulta al BE
     para obtener el precio que debe pagar el usuario */
    this.paypalForm(this.idReserva).subscribe({
      next: response => {
        // Cuando pulsamos en pagar directamente rellenamos los datos necesarios para enviarlo a paypal
        this.createPayment(this.paypalRequest);
      }
    });
  }

  /**
   * Función encargada de crear el pago de Paypal
   * @param formularioPaypal
   */
  createPayment(formularioPaypal: FormularioPaypalRequest) {
    this.servicioCompartido.showSpinnerModal();
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

  /**
   * Función encargada de autorellenar el formulario con los datos necesarios para enviarlo a paypal
   * @returns 
   */
  paypalForm(idReservasUsuario: number): Observable<FormularioPaypalRequest> {
    this.paypalRequest.idReserva = idReservasUsuario;
    this.paypalRequest.metodo = 'Paypal';
    this.paypalRequest.descripcion = 'Pago Abono Pista';
    this.paypalRequest.divisa = 'EUR';
    this.paypalRequest.intencion ='SALE';
    /* A partir del id Reserva puedo obtener el precio a abonar, utilizamos el pipe junto al map para envolver el
     resultado obtenido en un Objeto FormularioPaypalRequest */
    return this.reservaUsuario.obtainPriceReservation(idReservasUsuario).pipe(
      map(response => {
        this.paypalRequest.total = response
        return this.paypalRequest;
      })
    );    
  }


}
