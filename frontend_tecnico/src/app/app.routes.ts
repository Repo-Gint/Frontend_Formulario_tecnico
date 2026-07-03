import { Routes } from '@angular/router';
import { Home } from './tecnico/home/home';
import { tecnicoGuardGuard } from './guards/tecnico-guard-guard';
import { Login } from './auth/login/login';
import { RegistrarOrden } from './tecnico/modules/ordenes/registrar-orden/registrar-orden/registrar-orden';

export const routes: Routes = [
    {
        path: 'login',
        component: Login
    },
    {
        path: '',
        component: Home,
        canActivate: [tecnicoGuardGuard],
        canActivateChild: [tecnicoGuardGuard],

        children: [
            {
            path: 'ordenes/registrar',
            component: RegistrarOrden
            }
        ]
    }
];
