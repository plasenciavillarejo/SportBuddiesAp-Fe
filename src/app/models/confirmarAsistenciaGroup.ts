import { ConfirmarAsistenciaResponse } from "./confirmarAsistenciaResponse";

export class ConfirmarAsistenciaGroup {

    key!: string;
    
    actividad!: string;
    
    fechaReserva!: Date;
    
    hora!: string;
    
    usuarios!: ConfirmarAsistenciaResponse[];

}