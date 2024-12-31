import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionUser } from '@corbado/types';
import Corbado from '@corbado/web-js';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { CredentialPasskeys } from '../../models/credentialPasskeys';
import { PublicKeyCreate } from '../../models/publicKeyCreate';
import { TokenService } from '../../services/token.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login-passkeys',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login-passkeys.component.html',
  styleUrl: './login-passkeys.component.css'
})

export class LoginPasskeysComponent implements OnInit {

  authorize_uri = environment.authorize_uri;
  // Establece el usuario que se ha logueado por el passkeys
  user: SessionUser | undefined = undefined

  nombreUsuario: string = '';

  isSubmitting = false;
  isLogin = false;
  codeVerifier!: string;
  codeChallange!: string;

  publicKey: PublicKeyCreate = new PublicKeyCreate();
  credentialPassKeys: CredentialPasskeys = new CredentialPasskeys();

  @ViewChild('corbadoAuth', { static: true }) authElement!: ElementRef;


  constructor(private router: Router,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private tokenService: TokenService
  ) { }

  async ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.isLogin = params['isLogin'];
      if (this.isLogin) {
        this.loginWithPasskeys();
        const spinnerModalPasskeys = document.getElementById('spinner-modal-passkeys');
        if (spinnerModalPasskeys) {
          // Agregamos los elementos a mano para evitar conflicto con bootstrap
          spinnerModalPasskeys.classList.add('show');
          spinnerModalPasskeys.style.display = 'block';
          document.body.classList.add('modal-open');
          const backdrop = document.createElement('div');
          backdrop.className = 'modal-backdrop fade show';
          document.body.appendChild(backdrop);
        }
        /*
        await Corbado.load({
          projectId: environment.username_cobardo,
          darkMode: 'off',
        });
    
        // mount Corbado auth UI for the user to sign in or sign up
        Corbado.mountAuthUI(this.authElement.nativeElement, {
          onLoggedIn: () => {
            // Get the user data from the Corbado SDK
            this.user = Corbado.user
             Este usuario se tiene que insertar en base de datos apuntado al servicio /usuario/crear
            enviando el usuario y el email lo demás puede ir todo vacío
            
            this.authService.loginCorbadoPassKey(this.user!.email).subscribe({
              next: response => {
                console.log(response);
                this.router.navigate(['/'])
              }, error: error => {
              }
            });
          },
        })*/
      }
    });
  }

  /**
   * Función encargada de generar el Passkeys.
   * 1º Genera el objeto 
   * 2º Lo valida y se almacena en BBDD. Posteriormente ya podrá entrar el usuasrio mediante su clave publica.
   * */
  public async createPasskey(): Promise<void> {
    if (this.isSubmitting) {
      // Si ya se está enviando, no hacer nada
      return;
    }
    this.isSubmitting = true;
    this.authService.passkeyRegister(this.nombreUsuario).subscribe({
      next: async response => {
        if (response != null) {
          const publicKey = {
            challenge: this.base64UrlToArrayBuffer(response.challenge.value),
            rp: response.rp,
            user: {
              id: this.base64UrlToArrayBuffer(response.user.id),
              name: response.user.name,
              displayName: response.user.displayName,
            },
            pubKeyCredParams: response.pubKeyCredParams.map((param: any) => ({
              type: param.type,
              alg: param.alg,
            })),
            timeout: response.timeout,
            excludeCredentials: response.excludeCredentials.map((cred: any) => ({
              id: this.base64UrlToArrayBuffer(cred.id),
              type: cred.type,
            })),
            authenticatorSelection: response.authenticatorSelection,
            attestation: response.attestation,
            extensions: response.extensions,
          };

          // Crear la credencial con WebAuthn
          await navigator.credentials.create({ publicKey }).then((newCredential: any) => {
            console.log('Credencial creada:', newCredential);
            // Credencial para validar en el BE.
            console.log('Llave pública: ', newCredential.response.publicKey);

            const credential = {
              id: newCredential.id,
              rawId: this.base64urlEncode(newCredential.rawId),
              type: newCredential.type,
              response: {
                attestationObject: this.base64urlEncode(newCredential.response.attestationObject),
                clientDataJSON: this.base64urlEncode(newCredential.response.clientDataJSON),
              },
              clientExtensionResults: newCredential.getClientExtensionResults(),
              nombreUsuario: response.user.name
            };

            // Una vez creada dicha credencial, se envia al BE para validarla, si todo es correcto se genera.
            this.authService.validateCredential(credential).subscribe({
              next: response => {
                if (response != null) {
                  this.isSubmitting = false;
                  console.log(response);
                  Swal.fire({
                    title: 'Registro exitoso',
                    text: 'Tu clave de acceso se ha registrado correctamente. Ahora puedes usarla para iniciar sesión.',
                    icon: 'success',
                    confirmButtonText: 'Entendido',
                  });
                  this.router.navigate(['/']);
                } else {
                  this.isSubmitting = false;
                  Swal.fire({
                    title: 'Error al registrar tu clave',
                    text: 'Hubo un problema al procesar tu clave. Por favor, intenta nuevamente o contacta al soporte.',
                    icon: 'error',
                    confirmButtonText: 'Reintentar',
                  });
                }
              }, error: error => {
                this.isSubmitting = false;
                Swal.fire({
                  title: 'Error al validar tu clave',
                  text: 'Hubo un problema validando tu clave. Por favor, intenta nuevamente o contacta al soporte.',
                  icon: 'error',
                  confirmButtonText: 'Reintentar',
                });
              }
            });
          })
        }
      }, error: error => {
        this.isSubmitting = false;
        Swal.fire({
          title: 'Error al registrar tu clave',
          text: 'Hubo un problema al procesar tu clave. Por favor, intenta nuevamente o contacta al soporte.',
          icon: 'error',
          confirmButtonText: 'Reintentar',
        });
      }
    });

  }

  /**
   * Función para validar el login con Passkeys.
   */
  public async loginWithPasskeys(): Promise<void> {
    this.authService.obtainGenerteChallengeBe().subscribe({
      next: challengeResponseBe => {
        challengeResponseBe = this.base64UrlToArrayBuffer(challengeResponseBe["code-challenge"]);
        // Configurar las opciones correctamente
        const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
          challenge: challengeResponseBe,
          allowCredentials: [],
          userVerification: 'preferred',
        };

        // Validamos los datos con el navegador
        navigator.credentials.get({ publicKey: publicKeyCredentialRequestOptions })
          .then((assertion: any) => {
            const credentialPasskeyNavigation = {
              credentialId: this.base64ToBase64Url(assertion.id),
              rawId: this.base64urlEncode(assertion.rawId),
              challangeGenerateBe: this.base64urlEncode(challengeResponseBe),
              authenticatorData: this.base64urlEncode(assertion.response.authenticatorData),
              clientDataJson: this.base64urlEncode(assertion.response.clientDataJSON),
              signature: this.base64urlEncode(assertion.response.signature)
            };
            console.log(credentialPasskeyNavigation);
            console.log(JSON.stringify(credentialPasskeyNavigation));

            this.authService.loginPassKeys(credentialPasskeyNavigation).subscribe({
              next: response => {
                if (response) {
                  this.tokenService.setToken(response.access_token, response.refresh_token);
                  const spinnerModalPasskeys = document.getElementById('spinner-modal-passkeys');
                  if (spinnerModalPasskeys) {
                    // Agregamos los elementos a mano para evitar conflicto con bootstrap
                    spinnerModalPasskeys.classList.remove('show');
                    spinnerModalPasskeys.style.display = 'none';
                    document.body.classList.remove('modal-open');
                    const backdrop = document.querySelector('.modal-backdrop');
                    if (backdrop) {
                      backdrop.remove();
                    }
                  }
                  this.router.navigate(['']);
                }
              }, error: error => {
                Swal.fire({
                  title: 'Error al intentar hacer el login',
                  text: 'Hubo un problema al procesar tu clave. Por favor, intenta nuevamente o contacta al soporte.',
                  icon: 'error',
                  confirmButtonText: 'Reintentar',
                });
              }
            })
          })
          .catch((err: any) => {
            console.error("Error durante la autenticación", err);
          });

      }, error: error => {
        console.log(error);
      }
    });
  }

  /**
    * Función auxiliar para convertir ArrayBuffer en Base64-url
    * @param buffer 
    * @returns 
    */
  private base64urlEncode(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    const binary = String.fromCharCode(...bytes);
    const base64 = btoa(binary);
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  private base64ToBase64Url(base64: string) {
    return base64.replace(/-/g, '+').replace(/_/g, '/');
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