import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServicioCompartidoService {

  // Inicio de los servicios compartidos, una vez que ceamos el emiter tenemos que irnos al componente donde queramos llamarlo
  private _loginhandlerEventEmitter = new EventEmitter();

  // Este servicio se va a crear dentro de authorize.components.ts y lo va a consumir el header.component.ts
  private _initSessionEventEmitter = new EventEmitter();

  private _redirectHeaderEventEmitter = new EventEmitter();

  constructor() { }

  get loginhandlerEventEmitter() {
    return this._loginhandlerEventEmitter;
  }

  get initSessionEventEmitter() {
    return this._initSessionEventEmitter;
  }

  get redirectHeaderEventEmitter() {
    return this._redirectHeaderEventEmitter;
  }
}
