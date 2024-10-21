import { Deporte } from "./deporte";
import { Usuario } from "./usuario";

export class ReservasResponse {

    idReserva!: number;

    fechaReserva: Date = new Date();

    horaInicioReserva!: string;

    horaFinReserva!: string;

    observaciones!: string;

    usuarioReservaDto: Usuario = new Usuario();

    deporteReservaDto: Deporte = new Deporte();

    abonado!: boolean;
}