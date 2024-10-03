import { Rol } from "./rol";

export class Usuario {
    
    idUsuario!: number;

    nombreUsuario!: string;

    apellido!: string;

    email!: string;

    rol!: Rol[];

    password!: string;
    
}