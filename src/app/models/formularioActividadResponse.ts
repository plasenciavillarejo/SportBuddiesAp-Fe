import { Usuario } from "./usuario";

export class FormularioActividadResponse {

    idReservaActividad!: number;

    fechaReserva: Date = new Date();

    horaInicio!: string;

    horaFin!: string;

    actividad!: string;

    provincia!: string;

    municipio!: string;
    
    usuarioActividadDto: Usuario = new Usuario();

    usuariosMaxRequeridos!: number;

    plazasRestantes!: number;

    requerimientos: string [] = [];

    urgencia!: string;

    abonoPista!: number;

}