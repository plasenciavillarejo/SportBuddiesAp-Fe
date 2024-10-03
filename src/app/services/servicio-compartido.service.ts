import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServicioCompartidoService {

  private _loginhandlerEventEmitter = new EventEmitter();

  constructor() { }

  get loginhandlerEventEmitter() {
    return this._loginhandlerEventEmitter;
  }


}
