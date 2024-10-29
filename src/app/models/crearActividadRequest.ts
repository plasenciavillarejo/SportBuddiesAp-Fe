export class CrearActividadRequest {

    fechaReserva?: Date;

    horaInicio?: string;

    horaFin?: string;

    requerimientos = [] as string [];

    usuariosMaxRequeridos!: number;

    idUsuarioActividadDto!: number;

    actividad!: string;

    provincia!: string;

    municipio!: string;

    direccion!: string;

    codigoPostal!: number;

    urgencia!: string;

    abonoPista!: string;

    
}