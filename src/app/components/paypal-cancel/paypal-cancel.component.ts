import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-paypl-cancel',
  standalone: true,
  imports: [],
  templateUrl: './paypal-cancel.component.html'
})

export class PaypalCancelComponent implements OnInit {


  constructor(private activatedRoute: ActivatedRoute,
    private router: Router){

  }

  ngOnInit(): void {
    // Recibe la petición de cancelacion de pago por paypal, agregar un parametro a true y lo envia a la URL /usuarios
    this.activatedRoute.queryParams.subscribe(data => {
      this.router.navigate(['/usuarios'], { 
        queryParams: { 'cancel-paypal': true },
        replaceUrl: true 
      });
    });
  }
}
