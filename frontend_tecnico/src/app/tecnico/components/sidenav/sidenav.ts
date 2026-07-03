import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  imports: [],
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