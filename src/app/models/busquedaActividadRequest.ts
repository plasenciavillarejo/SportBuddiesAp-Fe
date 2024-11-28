import { CaracteristicasPaginacion } from "./caracteristicasPaginacion";

export class BusquedaActividadRequest {

    fechaReserva?: Date;

    actividad!: string;

    provincia!: string;

    municipio!: string;
 
    idUsuario!: number;

    caracteristicasPaginacion: CaracteristicasPaginacion = new CaracteristicasPaginacion();

    paginaInicio!: boolean;
    
}