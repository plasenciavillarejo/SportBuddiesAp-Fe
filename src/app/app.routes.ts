import { Routes } from '@angular/router';
import { LoginComponent } from './paginas/login/login.component';
import { UsuariosComponent } from './paginas/usuarios/usuarios.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'usuarios'
    },
    {
        path: 'login',
        component: LoginComponent
      } 
    /*,
    Para crear mas Routes
    {
        path: 'usuarios',
        component: UsuariosComponent
    }
    */

];
