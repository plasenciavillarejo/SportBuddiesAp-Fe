import { ConfirmarAsistenciaResponse } from "./confirmarAsistenciaResponse";
import { HoraConfirmarAsitenciaGroup } from "./horaConfirmarAsitenciaGroup";

export class ConfirmarAsistenciaGroup {

    key!: string;
    
    actividad!: string;
    
    fechaReserva!: Date;
    
    hora!: string;
    
    mapHorasUsuario!: HoraConfirmarAsitenciaGroup[];

}