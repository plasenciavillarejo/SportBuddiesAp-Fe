import { Rol } from "./rol";

export class Reserva {
    
    idReserva!: number;

    fechaReserva!: Date;

    horaInicioReserva!: String;

    horaFinReserva!: string;

    observaciones!: String;

    rol!: Rol[];

}