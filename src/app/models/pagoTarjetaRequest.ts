export class PagoTarjetaRequest {

    nombreTitular! : string;

    numeroTarjeta!: number;

    fechaExpiracion!: String;

    cvc!: number;

    metodoPago!: string;

    cantidad!: number;

    divisa!: string;

    descripcion!: string;

    idUsuario!: number;
    
    idReservaUsuario!: number;
    
}