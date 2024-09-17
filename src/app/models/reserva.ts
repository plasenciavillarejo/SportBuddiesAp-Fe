import { Deporte } from "./deporte";
import { Rol } from "./rol";
import { Usuario } from "./usuario";

export class Reserva {
    
    idReserva!: number;

    fechaReserva!: Date;

    horaInicioReserva!: String;

    horaFinReserva!: string;

    observaciones!: String;

    usuarioReserva!: Usuario;

    deporteReserva!: Deporte;
}