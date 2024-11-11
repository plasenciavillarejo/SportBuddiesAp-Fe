import { Component, OnInit } from '@angular/core';
import { ClienteOauthRequest } from '../../models/clienteOauthRequest';
import { FormsModule, NgModel } from '@angular/forms';
import { CommonModule, NgFor } from '@angular/common';
import { ClienteOauthService } from '../../services/cliente-oauth.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-nuevo-cliente-oauth',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './nuevo-cliente-oauth.component.html'
})
export class NuevoClienteOauthComponent implements OnInit {

  clienteOauth: ClienteOauthRequest = new ClienteOauthRequest();

  autorizathion = [
    { value: 'authorization_code', checked: false },
    { value: 'refresh_token', checked: false }
  ];

  scopes = [
    { value: 'openid', checked: false },
    { value: 'profile', checked: false }
  ];

  redirectUris: string[] = [''];

  showNextInput: boolean = false; 

  formSubmit!: boolean;

  errorClientId!: boolean;
  
  errorClientSecret!: boolean;
  
  errorClientName!: boolean;
  
  errorAuthMethod!: boolean;
  
  errorTipoAutorizacion!: boolean;
  
  errorAccesToken!: boolean;
  
  errorRefreshToken!: boolean;
  
  errorRedictUris!: boolean;
  
  errorPosLogoutUris!: boolean;

  resetCheck!: boolean;

  constructor(private clientOauthServie: ClienteOauthService) {
  }

  ngOnInit(): void {

  }

  /**
   * Función encargada de manejar el estado del checkbox en las autorizaciones
   * @param authItem 
   */
  onCheckboxChangeAuthorization(authItem: any): void {
    if (authItem.checked) {
      this.clienteOauth.authorizationGrantTypes.push(authItem.value);
    } else {
      // Si el checkbox se deselecciona, eliminar el valor de la lista
      const index = this.clienteOauth.authorizationGrantTypes.indexOf(authItem.value);
      if (index > -1) {
        this.clienteOauth.authorizationGrantTypes.splice(index, 1);
      }
    }
  }

  /**
 * Función encargada de manejar el estado del checkbox en los scopes
 * @param scopeItem 
 */
  onCheckboxChangeScopes(scopeItem: any): void {
    if (scopeItem.checked) {
      this.clienteOauth.scopes.push(scopeItem.value);
    } else {
      // Si el checkbox se deselecciona, eliminar el valor de la lista
      const index = this.clienteOauth.scopes.indexOf(scopeItem.value);
      if (index > -1) {
        this.clienteOauth.scopes.splice(index, 1);
      }
    }
  }

  /**
  * Recibe la posición del input y su valor para agregar al objeto this.redirectUris el valor de la URL
  * @param index 
  * @param value 
  */
  updateUri(index: number, value: string): void {
    this.redirectUris[index] = value;
  }

  /**
   * Funcion encargada de agregar un nuevo input vacío dentro de 'redirectUri'
   */
  updateRedirectUris(): void {
    console.log(this.redirectUris);
    this.redirectUris.push('');
  }

  /**
   * Función encargada de recibir el valor del índice el input para eliminar el input
   * @param index 
   */
  removeInput(index: number) {
    if (this.redirectUris.length > 1) {
      this.redirectUris.splice(index, 1); // Elimina el elemento del array
    }
  }


  /**
   * Función encargada de enviar el formulario para crear un nuevo clientes para el acceso de la apliación
   * @param clienteOauth 
   */
  createActivity(clienteOauth: ClienteOauthRequest): void {
    this.formSubmit = true;
    this.resetCheck = false;
    this.validateForm(clienteOauth);

    this.clienteOauth.redirectUris = this.redirectUris;
    if (typeof clienteOauth.authenticationMethods === 'string') {
      // Convertirlo en un array en el caso de que solo se agregue un único valor
      clienteOauth.authenticationMethods = [clienteOauth.authenticationMethods];
    }
    if(typeof clienteOauth.postLogoutRedirectUris === 'string') {
      clienteOauth.postLogoutRedirectUris = [clienteOauth.postLogoutRedirectUris];
    }
    console.log('CLiente recibido: ', this.clienteOauth);
    this.clientOauthServie.createNewClientOauth(clienteOauth).subscribe({
      next: next => {
          Swal.fire(
            'Cliente Oauth',
            'Se ha registrado correctamente el cliente para la aplicación', 
            'success'
          )
          this.clienteOauth = new ClienteOauthRequest();
          this.resetCheckboxes();
      }, error: error => {
        Swal.fire(
          'Cliente Oauth',
           error.error.message, 
          'error'
        )
      }
    });

  }

  validateForm(clienteOauth: ClienteOauthRequest): void {
    this.errorClientId = clienteOauth.clientId === undefined || clienteOauth.clientId.trim() === '';
    this.errorClientSecret = clienteOauth.clientSecret === undefined || clienteOauth.clientSecret.trim() === '';
    this.errorClientName = clienteOauth.clientName === undefined || clienteOauth.clientName.trim() === '';
    this.errorAuthMethod = clienteOauth.authenticationMethods === undefined;
    this.errorAccesToken = clienteOauth.timeAccesToken === undefined || String(clienteOauth.timeAccesToken).trim() === '';
    this.errorRefreshToken = clienteOauth.timeRefrehsToken === undefined || String(clienteOauth.timeRefrehsToken).trim() === '';
    if(this.errorClientId || this.errorClientSecret || this.errorClientName || this.errorAuthMethod || this.errorAccesToken
      || this.errorRefreshToken
    )  {
      throw new Error();
    }
  }

  /**
   * FUnción encargada de resetear los checks una vez que se ha creado el usuaruio
   */
  resetCheckboxes(): void {
    // Restablecer los valores de checked a false
    this.scopes.forEach(scopeItem => {
      scopeItem.checked = false; // Desmarcar todos los checkboxes
    });

    this.autorizathion.forEach(authori => {
      authori.checked = false;
    });
  
    this.resetCheck = true;
  
  }

}
