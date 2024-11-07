import { Component,  OnInit, } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';
import { ServicioCompartidoService } from '../../services/servicio-compartido.service';

@Component({
  selector: 'app-authorize',
  standalone: true,
  imports: [],
  templateUrl: './authorize.component.html'
})
export class AuthorizeComponent implements OnInit {

  code: string = '';

  constructor(private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router,
    private servicioCompartido: ServicioCompartidoService
  ){}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(data => {
      this.code = data['code'];
      // Una vez que lo hemos almacenado en la variable la eliminaremos del local Storage
      const code_verifier = this.tokenService.getVerifier();
      this.tokenService.deleteVerifier();
      this.getToken(this.code, code_verifier);
    });
  }

  getToken(code: string, code_verifier: string):void {
    this.authService.getToken(code, code_verifier).subscribe({
      next: response => {
        console.log(response);
        this.tokenService.setToken(response.access_token, response.refresh_token);
        // Agregamos al servicio compartido el valor true que posteriormente lo va a consumir el header.component.ts
        this.servicioCompartido.initSessionEventEmitter.emit(true);
        // Una vez que obtenemos el token, nos redirige a la pagina inicial por defecto
        this.router.navigate(['']);
      }, error: error => {
        if (error.status === 400 && error.error.error == "invalid_grant") {
          console.log(error.error.error);
          this.router.navigate(['']); // Redirigir de todos modos
        } 
      }
    });
  }

}
