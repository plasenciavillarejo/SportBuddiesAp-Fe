import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { PagoTarjetaService } from '../../services/pago-tarjeta.service';
import { PagoTarjetaRequest } from '../../models/pagoTarjetaRequest';
import { ServicioCompartidoService } from '../../services/servicio-compartido.service';
import { SpinnerModalComponent } from '../spinner-modal/spinner-modal.component';

@Component({
  selector: 'app-pago-tarjeta',
  standalone: true,
  imports: [FormsModule, SpinnerModalComponent],
  templateUrl: './pago-tarjeta.component.html',
  styleUrl: './pago-tarjeta.component.css'
})
export class PagoTarjetaComponent implements OnInit {

  pagoTarjetaRequest: PagoTarjetaRequest = new PagoTarjetaRequest();

  // PLASENCIA - CAMBIAR LUEGO A VARIABLES ENVIRONMENT
  stripe: Stripe | null = null;

  cardElement: any;
  cardHolderName: string = '';

  idReservaUsuario!: number;
  nombreActividad!: string;
  precioActividad!: number;
  pagoTarjeta: boolean = false;

  constructor(private activatedRoute: ActivatedRoute,
    private pagoTarjetaService: PagoTarjetaService,
    private servicioCompartido: ServicioCompartidoService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.idReservaUsuario = params['idReservaUsuario'];
      this.nombreActividad = params['nombreActividad'];
      this.precioActividad = params['precioActividad'];
    });
    this.pagoTarjeta = true;

    loadStripe('pk_test_51QHLE5KPTU50YCkCu2PCHKCHyjTj0tgu0oUvbvQQQCLiDJkiw0xoaGmJ1rDiV7glZvtbxzIbyn30LAOwn5IVhJ8f008GoACgYJ')
      .then((stripeInstance) => {
        this.stripe = stripeInstance;
        this.cardElement = this.stripe!.elements().create('card');
        this.cardElement.mount('#card-element');
      });
  }

  nombreTitular: string = '';
  cargando: boolean = false;
  mensaje: string = '';

  /**
   * Función encargada de realizar el pago
   * @param pagoTarjetaRequest
   * @returns 
   */
  processPayment(pagoTarjetaRequest: PagoTarjetaRequest) {
    if (!this.stripe) {
      console.error('Stripe has not been initialized');
      return;
    }

    this.stripe.createPaymentMethod({
      type: 'card',
      card: this.cardElement,
      billing_details: {
        name: pagoTarjetaRequest.nombreTitular,
      },
    }).then((result) => {
      if (result.error) {
        console.error(result.error.message);
      } else {
        console.log('PaymentMethod created:', result.paymentMethod);
        // Lógica adicional para manejar el resultado del pago
        this.servicioCompartido.showSpinnerModal();
      }
    });
  }

}