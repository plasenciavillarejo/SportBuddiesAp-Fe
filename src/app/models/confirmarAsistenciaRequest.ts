import { CaracteristicasPaginacion } from "./caracteristicasPaginacion";

export class ConfirmarAsistenciaRequest {
    idUsuario!: number;

    caracteristicasPaginacion: CaracteristicasPaginacion= new CaracteristicasPaginacion();
}