import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  imports: [RouterLink],
  standalone: true,
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.css',
})
export class Sidenav {

  constructor(
    private router: Router
  ) {}

  public abrirModalRegistrarOrden(): void {
    this.router.navigate(['/ordenes/registrar']);
  }

}