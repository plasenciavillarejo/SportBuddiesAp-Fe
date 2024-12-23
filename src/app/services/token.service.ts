import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import * as CryptoJS from 'crypto-js';
import { Observable } from 'rxjs';

const ACCES_TOKEN = 'access_token';
const REFRESH_TOKEN = 'refresh_token';
const CODE_VERIFIER = 'code_verifier';


@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }


  setToken(access_token: string, refresh_token: string): void {
    localStorage.removeItem(ACCES_TOKEN);
    localStorage.setItem(ACCES_TOKEN, access_token);
    localStorage.removeItem(REFRESH_TOKEN);
    localStorage.setItem(REFRESH_TOKEN, refresh_token);
  }

  getAccesToken(): string | null {
    return localStorage.getItem(ACCES_TOKEN);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN);
  }

  clearToken() {
    localStorage.removeItem(ACCES_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
  }

  isAuthenticate(): boolean {
    if(localStorage.getItem(ACCES_TOKEN) != null) {
      return true;
    } else {
      return false;
    }    
  }

  // Función para verificar si el usuario es administrador
  isRoleAdmin(): boolean {
    return this.hasRole('ROLE_ADMIN');
  }

  // Función para verificar si el usuario es un usuario normal
  isRoleUser(): boolean {
    return this.hasRole('ROLE_USER');
  }

  // Función que verifica si el usuario tiene un rol específico
  hasRole(role: string): boolean {
    if (!this.isAuthenticate()) {
      return false;
    }
    const roles = this.verificationRole();
    return roles.includes(role);
  }

  // Función para obtener los roles del token
  verificationRole(): string[] {
    const token = this.getAccesToken();

    // El token se contiene en tres partes, la segunda parte es donde viene la información de los claims
    const payload = token!.split(".")[1];

    // Decodificamos el Payload
    const payloadDecoded = atob(payload);
    const values = JSON.parse(payloadDecoded);
    return values.roles || []; // Asegúrate de devolver un array vacío si no hay roles
  }

  setVerifier(code_verifier: string): void {
    // Debemos de cifrar el secret
    if(localStorage.getItem(CODE_VERIFIER)) {
      this.deleteVerifier();
    }
    const encryptVerifier = CryptoJS.AES.encrypt(code_verifier, environment.secret_pkce);
    localStorage.setItem(CODE_VERIFIER, encryptVerifier.toString());
  }

  getVerifier(): string {
    const encrypted = localStorage.getItem(CODE_VERIFIER);
    const decrypted = CryptoJS.AES.decrypt(encrypted!, environment.secret_pkce).toString(CryptoJS.enc.Utf8);
    return  decrypted;
  }

  deleteVerifier(): void {
    localStorage.removeItem(CODE_VERIFIER);
  }

  obtainNameUser(): string {
    const token = this.getAccesToken();
    if (!token) {
      return "";
    }
    // El token se contiene en tres partes, la segunda parte es donde viene la información de los claims
    const payload = token!.split(".")[1];

    // Decodificamos el Payload
    const payloadDecoded = atob(payload);
    const values = JSON.parse(payloadDecoded);
    return values.sub;
  }

  obtainRoles(): string {
    const token = this.getAccesToken();

    // El token se contiene en tres partes, la segunda parte es donde viene la información de los claims
    const payload = token!.split(".")[1];

    // Decodificamos el Payload
    const payloadDecoded = atob(payload);
    const values = JSON.parse(payloadDecoded);
    return values.roles;
  }

  obtainIdUser() : number {
    const token = this.getAccesToken();

    // El token se contiene en tres partes, la segunda parte es donde viene la información de los claims
    const payload = token!.split(".")[1];

    // Decodificamos el Payload
    const payloadDecoded = atob(payload);
    const values = JSON.parse(payloadDecoded);
    return values.idusuario;
  }
  

  tokenExpired(): boolean {
    const token = this.getAccesToken();
    const payload = token!.split(".")[1];
    // Decodificamos el Payload
    const payloadDecoded = atob(payload);    
    const exp = JSON.parse(payloadDecoded).exp;
    // Convertirmos milsegundo en segundos y comparamos
    return new Date().getTime() / 1000 > exp ? true : false;
  }


  obtainIdUserObservable() : Observable<any> {
    const token = this.getAccesToken();

    // El token se contiene en tres partes, la segunda parte es donde viene la información de los claims
    const payload = token!.split(".")[1];

    // Decodificamos el Payload
    const payloadDecoded = atob(payload);
    const values = JSON.parse(payloadDecoded);
    return values.idusuario;
  }

}
