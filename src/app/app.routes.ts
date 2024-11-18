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
import { PaypalCancelComponent } from './components/paypal-cancel/paypal-cancel.component';
import { NuevoUsuarioComponent } from './components/nuevo-usuario/nuevo-usuario.component';
import { PagoTarjetaComponent } from './components/pago-tarjeta/pago-tarjeta.component';
import { PaginadorComponent } from './components/paginador/paginador.component';

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
        canActivate: [authGuard]
    },
    {
        path: 'nuevo-cliente-oauth',
        component: NuevoClienteOauthComponent,
        canActivate: [authGuard]
    },
    {
        path: 'mis-reservas',
        component: MisReservasComponent,
        canActivate: [authGuard]
    },
    {
        path: 'historial-reservas',
        component: HistorialReservasComponent,
        canActivate: [authGuard]
    },
    {
        path: 'paypal/:id',
        component: PaypalComponent,
    },
    {
        path: 'paypal-cancel',
        component: PaypalCancelComponent,
    },
    {
        path: 'nuevo-usuario',
        component: NuevoUsuarioComponent
    },
    {
        path: 'mi-cuenta/:idUsuario',
        component: NuevoUsuarioComponent,
        canActivate: [authGuard]
    },
    {
        path: 'pago-tarjeta/:idReservaUsuario/:nombreActividad/:precioActividad',
        component: PagoTarjetaComponent,
        canActivate: [authGuard]
    }
];
