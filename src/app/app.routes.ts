import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: '/usuarios'
    },
    /*{
        path: 'usuarios',
        component: UsuariosComponent
    }
     Para crear mas Routes
    {
        path: 'usuarios',
        component: UsuariosComponent
    },
    {
        path: 'usuarios',
        component: UsuariosComponent
    }
    */

];
