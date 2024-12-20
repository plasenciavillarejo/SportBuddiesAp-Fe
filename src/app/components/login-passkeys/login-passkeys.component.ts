import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SessionUser } from '@corbado/types';
import Corbado from '@corbado/web-js';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-passkeys',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login-passkeys.component.html',
  styleUrl: './login-passkeys.component.css'
})
export class LoginPasskeysComponent implements OnInit {

  // Establece el usuario que se ha logueado por el passkeys
  user: SessionUser | undefined = undefined

  nombreUsuario: string = '';

  @ViewChild('corbadoAuth', {static: true}) authElement!: ElementRef;

  constructor(private router: Router,
    private authService: AuthService
  ) {}

  async ngOnInit() {
   // Load and initialize Corbado SDK when the component mounts
    await Corbado.load({
      projectId: environment.username_cobardo,
      darkMode: 'off',
    });
    
    // mount Corbado auth UI for the user to sign in or sign up
    Corbado.mountAuthUI(this.authElement.nativeElement, {
      onLoggedIn: () => {
        // Get the user data from the Corbado SDK
        this.user = Corbado.user
        this.router.navigate(['/'])
      },
    })
  }
  

  createPasskey(): void {
    this.authService.loginWithPasskey(this.nombreUsuario).subscribe({
      next: response => {
        if(response != null) {
          console.log(response);
          
          const publicKey = {
            challenge: this.base64UrlToArrayBuffer(response.challenge.value), // Convertir el desafío a ArrayBuffer
            rp: response.rp, // Información de la Relying Party
            user: {
              id: this.base64UrlToArrayBuffer(response.user.id), // Convertir el ID del usuario a ArrayBuffer
              name: response.user.name,
              displayName: response.user.displayName,
            },
            pubKeyCredParams: response.pubKeyCredParams.map((param: any) => ({
              type: param.type,
              alg: param.alg,
            })),
            timeout: response.timeout,
            excludeCredentials: response.excludeCredentials.map((cred: any) => ({
              id: this.base64UrlToArrayBuffer(cred.id), // Convertir cada id a ArrayBuffer
              type: cred.type,
            })),
            authenticatorSelection: response.authenticatorSelection,
            attestation: response.attestation,
            extensions: response.extensions,
          };

          // Crear la credencial con WebAuthn
          navigator.credentials.create({ publicKey })
            .then((newCredential: any) => {
              // Aquí puedes manejar la nueva credencial
              console.log('Credencial creada:', newCredential);
              // Puedes enviar esta credencial al backend para su validación
              console.log('Llave pública: ', newCredential.response.publicKey);


            })
            .catch((error: any) => {
              console.error('Error creando la credencial:', error);
            });
        }
      }, error: error => {

      }
    });
  }


  private base64UrlToArrayBuffer(base64Url: string): ArrayBuffer {
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const binary = atob(base64);
    const len = binary.length;
    const buffer = new ArrayBuffer(len);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < len; i++) {
      view[i] = binary.charCodeAt(i);
    }
    return buffer;
  }

}
