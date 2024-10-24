import { Component, OnInit } from '@angular/core';
import { ClienteOauthRequest } from '../../models/clienteOauthRequest';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
import { ClienteOauthService } from '../../services/cliente-oauth.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-nuevo-cliente-oauth',
  standalone: true,
  imports: [FormsModule, NgFor],
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
      }, error: error => {
        Swal.fire(
          'Cliente Oauth',
          'No se ha registrado correctamente el cliente para la aplicación.' + error.error.message, 
          'error'
        )
      }
    });

  }


}
