import { Deporte } from "./deporte";
import { FormularioActividadResponse } from "./formularioActividadResponse";
import { Usuario } from "./usuario";

export class ReservasResponse {

    idReserva!: number;

    fechaReserva: Date = new Date();

    horaInicioReserva!: string;

    horaFinReserva!: string;

    observaciones!: string;

    usuarioReservaDto: Usuario = new Usuario();

    deporteReservaDto: Deporte = new Deporte();

    reservaActividadDto: FormularioActividadResponse = new FormularioActividadResponse();

    abonado!: boolean;
}