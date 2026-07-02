import { Component, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { UsuariosService } from '../../services/api/usuarios/usuarios';
import { MessagesService } from '../../services/messages/messages'; 

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {

  constructor(
    private usuariosService: UsuariosService,
    private messages: MessagesService,
    private router: Router,
    private renderer: Renderer2
  ) {}

  protected toggleSidebar(): void {
    const body = document.body;
    if (body.classList.contains('sb-sidenav-toggled')) {
      this.renderer.removeClass(body, 'sb-sidenav-toggled');
    } else {
      this.renderer.addClass(body, 'sb-sidenav-toggled');
    }
  }

  protected cerrarSesion(): void {

    this.messages.mensajeConfirmacionCustom(
      '¿Está seguro de cerrar sesión?',
      'question',
      'Cerrar sesión'
    ).then(res => {

      if (!res.isConfirmed) return;

      this.messages.mensajeEsperar();

      this.usuariosService.cerrarSesion().subscribe({

        next: (respuesta: any) => {

          this.messages.mensajeGenerico(
            respuesta.mensaje,
            'success',
            'Cerrar sesión'
          );

          localStorage.clear();

          this.router.navigate(['/login']);
        },

        error: (error) => {

          this.messages.mensajeGenerico(
            error?.error?.mensaje || 'Ocurrió un error al cerrar sesión.',
            'error'
          );

          localStorage.clear();
          this.router.navigate(['/login']);
        }

      });

    });
  }
}