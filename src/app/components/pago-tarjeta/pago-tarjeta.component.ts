import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { loadStripe, Stripe, StripeExpressCheckoutElementOptions } from '@stripe/stripe-js';
import { PagoTarjetaService } from '../../services/pago-tarjeta.service';
import { PagoTarjetaRequest } from '../../models/pagoTarjetaRequest';
import { ServicioCompartidoService } from '../../services/servicio-compartido.service';
import { SpinnerModalComponent } from '../spinner-modal/spinner-modal.component';
import { environment } from '../../../environments/environment';
import { TokenService } from '../../services/token.service';
import Swal from 'sweetalert2';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario';

@Component({
  selector: 'app-pago-tarjeta',
  standalone: true,
  imports: [FormsModule, SpinnerModalComponent],
  templateUrl: './pago-tarjeta.component.html',
  styleUrl: './pago-tarjeta.component.css'
})
export class PagoTarjetaComponent implements OnInit {

  pagoTarjetaRequest: PagoTarjetaRequest = new PagoTarjetaRequest();
  usuario: Usuario = new Usuario();

  // PLASENCIA - CAMBIAR LUEGO A VARIABLES ENVIRONMENT
  stripe: Stripe | null = null;

  cardElement: any;
  cardElementAll: any;
  cardHolderName: string = '';

  idReservaUsuario!: number;
  nombreActividad!: string;
  precioActividad!: number;
  pagoTarjeta: boolean = false;
  nombreTitular: string = '';
  cargando: boolean = false;
  mensaje: string = '';

  constructor(private activatedRoute: ActivatedRoute,
    private pagoTarjetaService: PagoTarjetaService,
    private servicioCompartido: ServicioCompartidoService,
    private tokenService: TokenService,
    private router: Router,
    private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.idReservaUsuario = params['idReservaUsuario'];
      this.nombreActividad = params['nombreActividad'];
      this.precioActividad = params['precioActividad'];
    });
    this.pagoTarjeta = true;

    loadStripe(environment.key_stripe)
      .then((stripeInstance) => {
        this.stripe = stripeInstance;
        this.cardElement = this.stripe!.elements().create('card');
        this.cardElement.mount('#card-element');

        /* Método que implementa los inputs de forma separada
        const elements = this.stripe!.elements();
        const cardNumber = elements.create('cardNumber');
        const cardExpiry = elements.create('cardExpiry');
        const cardCvc = elements.create('cardCvc');

        cardNumber.mount('#card-number'); // Div con id "card-number"
        cardExpiry.mount('#card-expiry'); // Div con id "card-expiry"
        cardCvc.mount('#card-cvc');       // Div con id "card-cvc"

        // Configuración del ExpressCheckoutElement
        const expressCheckoutOptions: StripeExpressCheckoutElementOptions = {
          buttonHeight: 40,    // Define la altura del botón
          buttonTheme: {
            applePay: 'black',  // Color del botón de Apple Pay
            googlePay: 'black', // Color del botón de Google Pay
            paypal: 'gold',     // Color del botón de PayPal
          },
          layout: {
            maxColumns: 2,     // Número máximo de columnas
            maxRows: 1,        // Número máximo de filas
            overflow: 'auto',  // Cómo manejar el desbordamiento
          },
          paymentMethods: {
            applePay: 'always',  // Apple Pay siempre visible
            googlePay: 'always', // Google Pay siempre visible
            paypal: 'auto',      // PayPal visible cuando sea adecuado
          },
        };

        // Crear un objeto de elementos de Stripe
        const elementsPayments = this.stripe!.elements();

        // Crear el elemento de ExpressCheckout
        const expressCheckoutElement = elementsPayments.create('expressCheckout', expressCheckoutOptions);

        // Verificar que el contenedor existe antes de montar el elemento
        const container = document.getElementById('express-checkout-element');
        if (container) {
          expressCheckoutElement.mount('#express-checkout-element');
        } else {
          console.error('El contenedor #express-checkout-element no existe en el DOM');
        }
        */
      });
  }

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
    // Obtenemos los datos del usuario necesario para rellenar los detalles de la tarjeta
    this.usuarioService.obtainUserDto(this.tokenService.obtainIdUser()).subscribe({
      next: (response) => {
        if(response != null){
          this.usuario = response;
          
          this.stripe?.createPaymentMethod({
            type: 'card',
            card: this.cardElement,
            billing_details: {
              name: pagoTarjetaRequest.nombreTitular,
              phone: this.usuario.numeroTelefono,
              email: this.usuario.email,
              address: {
                line1: this.usuario.direccion,
                city: this.usuario.provincia,
                postal_code: this.usuario.codigoPostal,
                country: 'ES'
              }
            },
          }).then((result) => {
            if (result.error) {
              Swal.fire(
                'Error en el pago',
                'Se ha producido un error a la hora de realizar el pago',
                'error'
              );
            } else {
              this.servicioCompartido.showSpinnerModal();
              pagoTarjetaRequest.metodoPago = result.paymentMethod.id;
              pagoTarjetaRequest.cantidad = this.precioActividad;
              pagoTarjetaRequest.divisa = 'EUR';
              pagoTarjetaRequest.descripcion = 'Pago Pista ' + this.nombreActividad;
              pagoTarjetaRequest.idUsuario = this.tokenService.obtainIdUser();
              pagoTarjetaRequest.idReservaUsuario = this.idReservaUsuario;

              this.pagoTarjetaService.paymentCard(pagoTarjetaRequest).subscribe({
                next: response => {
                  if (response.clientSecret != null) {
                    this.servicioCompartido.hideSpinnerModal();
                    Swal.fire(
                      'Pago confirmado',
                      'Se ha realizado el pago exitosamente',
                      'success'
                    );
                    this.router.navigate(['/usuarios'], { replaceUrl: true });
                  }
                }, error: error => {
                  this.servicioCompartido.hideSpinnerModal();
                  Swal.fire(
                    'Error en el pago',
                    'Se ha producido un error a la hora de realizar el pago',
                    'error'
                  );
                }
              });
            }
          });
        }
      }
    })
  }
}