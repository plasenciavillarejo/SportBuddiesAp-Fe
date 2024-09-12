import { Usuario } from "../models/usuario";

export const usuarioData: Usuario = {
    idUsuario: 1,    
    nombre: 'Jose',
    apellido: 'Plasencia',
    email: 'le@gmail.com',
    rol: [
        {
            idRol: 1,
            nombreRol: 'ADMIN'
        },
        {
            idRol: 2,
            nombreRol: 'USER'
        }   
    ]
}