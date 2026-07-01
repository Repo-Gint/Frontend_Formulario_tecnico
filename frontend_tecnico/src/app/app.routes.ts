import { Routes } from '@angular/router';
import { Home } from './tecnico/home/home';
import { tecnicoGuardGuard } from './guards/tecnico-guard-guard';
import { Login } from './auth/login/login';

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

        children: []
    }
];
