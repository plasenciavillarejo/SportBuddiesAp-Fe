import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { NuevaActividadComponent } from './components/nueva-actividad/nueva-actividad.component';
import { authGuard } from './core/guard/auth.guard';
import { AuthorizeComponent } from './components/authorize/authorize.component';
import { LogoutComponent } from './components/logout/logout.component';
import { NuevoClienteOauthComponent } from './components/nuevo-cliente-oauth/nuevo-cliente-oauth.component';
import { MisReservasComponent } from './components/mis-reservas/mis-reservas.component';
import { HistorialReservasComponent } from './components/historial-reservas/historial-reservas.component';
import { PaypalComponent } from './components/paypal/paypal.component';

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
        component: NuevaActividadComponent,
        canActivate: [authGuard]
    },
    {
        path: 'authorize',
        component: AuthorizeComponent,
    },
    {
        path: 'logout',
        component: LogoutComponent,
    },
    {
        path: 'nuevo-cliente-oauth',
        component: NuevoClienteOauthComponent,
    },
    {
        path: 'mis-reservas',
        component: MisReservasComponent,
    },
    {
        path: 'historial-reservas',
        component: HistorialReservasComponent,
    },
    {
        path: 'paypal',
        component: PaypalComponent,
    }
];
