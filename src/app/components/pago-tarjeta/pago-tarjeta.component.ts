import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { loadStripe, Stripe } from '@stripe/stripe-js';
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
  cardHolderName: string = '';

  idReservaUsuario!: number;
  nombreActividad!: string;
  precioActividad!: number;
  pagoTarjeta: boolean = false;

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
              console.error(result.error.message);
            } else {
              this.servicioCompartido.showSpinnerModal();
              console.log('PaymentMethod created:', result.paymentMethod);        
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
                  throw new error;
                }
              });
            }
          });
        }
      }
    })
  }
}