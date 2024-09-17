import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { NuevaActividadComponent } from './components/nueva-actividad/nueva-actividad.component';

export const routes: Routes = [
    /**Por defecto si el path es vació nos redigira a usuarios */
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'usuarios'
    },
    {
        path: 'usuarios',
        component: UsuariosComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'nueva-actividad',
        component: NuevaActividadComponent
    } 
];
