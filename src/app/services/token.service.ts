import { Injectable } from '@angular/core';

const ACCES_TOKEN = 'access_token';
const REFRESH_TOKEN = 'refresh_token';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }


  setToken(access_token: string, refresh_token: string): void {
    localStorage.setItem(ACCES_TOKEN, access_token);
    localStorage.setItem(REFRESH_TOKEN, refresh_token);
  }




}
