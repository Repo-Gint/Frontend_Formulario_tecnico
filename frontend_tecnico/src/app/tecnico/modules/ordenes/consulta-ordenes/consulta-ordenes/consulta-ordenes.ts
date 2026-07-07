import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { ModalService } from '../../../../services/modal/modal';
import { OrdenesService } from '../../../../services/api/ordenes/ordenes';
import { MessagesService } from '../../../../services/messages/messages';
import { RegistrarOrden } from '../../registrar-orden/registrar-orden/registrar-orden';


@Component({
  selector: 'app-consulta-ordenes',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './consulta-ordenes.html',
  styleUrl: './consulta-ordenes.css',
})
export class ConsultaOrdenes {

  protected datosTabla: any[] = [];

  private intervalo: any;

  constructor(
    private modal: ModalService,
    private ordenes: OrdenesService,
    private messages: MessagesService,
    private ch: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {

    this.messages.mensajeEsperar();

    await this.obtenerListaOrdenesUsuario();

    this.messages.cerrarMensajes();

    this.intervalo = setInterval(() => {
      this.obtenerListaOrdenesUsuario();
    },10000);

  }

  public async obtenerListaOrdenesUsuario(): Promise<void> {

  try {

    const respuesta = await this.ordenes
      .obtenerListaOrdenesUsuario()
      .toPromise();

    this.datosTabla = respuesta.ordenesUsuario ?? [];

    this.ch.markForCheck();

  } catch (error) {

    console.error(error);

    this.messages.mensajeGenerico(
      'Ocurrió un error al obtener las órdenes.',
      'error',
      'Error'
    );

  }

}
  public abrirModalRegistrarOrden(idOrden: string): void {

  this.modal.abrirModalConComponente(RegistrarOrden, {
    idOrden
  });

}

  ngOnDestroy():void{

      clearInterval(this.intervalo);

  }

}
