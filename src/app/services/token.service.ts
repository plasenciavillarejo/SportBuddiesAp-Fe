import { Injectable } from '@angular/core';

const ACCES_TOKEN = 'access_token';
const REFRESH_TOKEN = 'refresh_token';

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

}
