import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router } from '@angular/router';
import { ModalService } from '../tecnico/services/modal/modal';
import { MessagesService } from '../tecnico/services/messages/messages';

@Injectable({
  providedIn: 'root'
})
export class tecnicoGuardGuard implements CanActivate, CanActivateChild {

  constructor(
    private messages: MessagesService,
    private router: Router
  ) {}

  checkAuth(): boolean {
    const token = localStorage.getItem('token_orden_gitlatam');

    if (token) {
      return true;
    }

    this.messages.mensajeGenerico(
    'Debes iniciar sesión para acceder',
    'warning',
    'Acceso no autorizado'
  );

    this.router.navigate(['/login']);
    return false;
  }

  canActivate(): boolean {
    return this.checkAuth();
  }

  canActivateChild(): boolean {
    return this.checkAuth();
  }
}