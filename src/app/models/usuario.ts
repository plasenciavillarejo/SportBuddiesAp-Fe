import { Rol } from "./rol";

export class Usuario {
    
    idUsuario!: number;

    nombre!: string;

    apellido!: string;

    email!: string;

    rol!: Rol[];

}