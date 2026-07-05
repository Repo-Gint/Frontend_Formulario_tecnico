import { CommonModule } from '@angular/common';
import {ChangeDetectorRef, Component, Input, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

import { ModalService } from '../../../../services/modal/modal';
import { MessagesService } from '../../../../services/messages/messages';
import { OrdenesService } from '../../../../services/api/ordenes/ordenes';

@Component({
  selector: 'app-registrar-orden',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registrar-orden.html',
  styleUrl: './registrar-orden.css',
})
export class RegistrarOrden implements AfterViewInit {

  @Input() idOrden: any = null;

  @ViewChild('sigCanvas')
  sigCanvas!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;

  protected formOrden!: FormGroup;
  form: FormGroup;
  protected listatipoOrden: any[] = [];
  protected listafechas:    any[] = [];
  protected tipoOrdenSeleccionado: any = {id_type_order: null,type_order: ''};

  protected ordenesUsuario: any[] = [];

  constructor(
    private modal:    ModalService,
    private messages: MessagesService,
    private ordenes:  OrdenesService,
    private fb:       FormBuilder,
    private ch:       ChangeDetectorRef
  ) {
    this.form = this.fb.group({
    semanas: this.fb.array([]) 
  });
  }

  get semanas(): FormArray {
  return this.form.get('semanas') as FormArray;
}

createDay(): FormGroup {
  return this.fb.group({
    id: [''],
    date: [''],
    month: [''],
    trip: this.fb.group({
      start_trip: [''],
      arrival_trip: [''],
      out_departure: [''],
      out_arrival: [''],
      travel_time: ['']
    }),
    work: this.fb.group({
      work_start: [''],
      work_finish: [''],
      work_hours: ['']
    }),
    comments: ['']
  });
}

// Agregar una semana nueva
addSemana(): void {
  const semanaGroup = this.fb.group({
    dias: this.fb.array([this.createDay()]), 
    comments: ['']                           
  });
  this.semanas.push(semanaGroup);
}

// Agregar día a una semana específica
addDay(semanaIndex: number): void {
  const dias = this.semanas.at(semanaIndex).get('dias') as FormArray;
  dias.push(this.createDay());
}

// Eliminar día
removeDay(semanaIndex: number, dayIndex: number): void {
  const dias = this.semanas.at(semanaIndex).get('dias') as FormArray;
  dias.removeAt(dayIndex);
}

// Eliminar semana
removeSemana(index: number): void {
  this.semanas.removeAt(index);
}

getDias(semanaIndex: number): FormArray {
  return this.semanas.at(semanaIndex).get('dias') as FormArray;
}

  async ngOnInit(): Promise<any> {
    this.messages.mensajeEsperar();

    this.crearFormOrden();
    this.agregarWorkHour();
    await this.obtenerRecursosRegistroOrden();

    if (this.idOrden != null) {await this.obtenerDetalleOrden(this.idOrden);}

    this.messages.cerrarMensajes();
  }

  ngAfterViewInit(): void {
    this.ctx = this.sigCanvas.nativeElement.getContext('2d')!;
    this.initDrawing();
  }

  private initDrawing(): void {
    const canvas = this.sigCanvas.nativeElement;
    let painting = false;
    const startPosition = (e: MouseEvent) => {
      painting = true;
      draw(e);
    };

    const finishedPosition = () => {
      painting = false;
      this.ctx.beginPath();
    };

    const draw = (e: MouseEvent) => {
      if (!painting) return;
      this.ctx.lineWidth = 2;
      this.ctx.lineCap = 'round';
      const rect = canvas.getBoundingClientRect();
      this.ctx.lineTo(
        e.clientX - rect.left,
        e.clientY - rect.top
      );

      this.ctx.stroke();
      this.ctx.beginPath();

      this.ctx.moveTo(
        e.clientX - rect.left,
        e.clientY - rect.top
      );
    };

    canvas.addEventListener('mousedown', startPosition);
    canvas.addEventListener('mouseup', finishedPosition);
    canvas.addEventListener('mouseleave', finishedPosition);
    canvas.addEventListener('mousemove', draw);
  }

  public limpiarFirma(): void {
    this.ctx.clearRect(0, 0,
      this.sigCanvas.nativeElement.width,
      this.sigCanvas.nativeElement.height
    );
  }

  public selectTipo(event: any, tipo: any): void {

  const actual = this.formOrden.get('id_order_type')?.value || [];

  let updated = Array.isArray(actual) ? [...actual] : [];

  if (event.target.checked) {updated.push(tipo.id_type_order);
  } else {
    updated = updated.filter(x => x !== tipo.id_type_order);
  }

  this.formOrden.patchValue({
    id_order_type: updated
  });
}

  private crearFormOrden(): void {

  this.formOrden = this.fb.group({

    id_order_type: [''],
    id_status_order: [1],

     enginner: [''],
     place: [''],

    customer: this.fb.group({

      company: ['', Validators.required],
      customer: ['', Validators.required],
      position: ['', Validators.required],
      email_customer: ['', Validators.required],
      address: ['', Validators.required]

    }),

    equipment: this.fb.group({

      year: ['', Validators.required],
      model: ['', Validators.required],
      serial_number: ['', Validators.required],
      work_hours_total: ['', Validators.required]

    }),

    work_hours: this.fb.array([]),

    final_goal: ['', Validators.required],

    signature: [null],

    started_by: [null],
    start_date: [null],

    cancelled_by: [null],
    cancelled_at: [null],

    finished_by: [null],
    finished_at: [null]
  });

}

  get workHours(): FormArray {
    return this.formOrden.get('work_hours') as FormArray;
  }

  public agregarWorkHour(): void {

    this.workHours.push(

      this.fb.group({

        id:    [''],
        week:  [''],
        date:  [''],
        month: [''],

        trip: this.fb.group({
          start_trip:    [''],
          arrival_trip:  [''],
          out_departure: [''],
          out_arrival:   [''],
          travel_time:   ['']
        }),

        work: this.fb.group({
          work_start:  [''],
          work_finish: [''],
          work_hours:  ['']
        }),

        comments: ['']
      })
    );
  }

  public async obtenerRecursosRegistroOrden(): Promise<void> {
    try {
      const respuesta: any = await this.ordenes.obtenerRecursosRegistroOrden().toPromise();

      this.listatipoOrden = respuesta.recursos.listatipoOrden;
      this.listafechas    = respuesta.recursos.listafechas;

      this.ch.detectChanges();
    } catch (error) {
      this.messages.mensajeGenerico('error', 'error');
    }
  }

  public async obtenerDetalleOrden(idOrden: string): Promise<void> {

    return this.ordenes.obtenerDetalleOrden(idOrden).toPromise().then(

      respuesta => {

        const orden = respuesta.orden;

        this.formOrden.patchValue({

          id_type_order: orden.id_type_order,
          module: orden.module,
          place: orden.place,
          id_status_order: orden.id_status_order,
          final_goal: orden.final_goal,
          signature: orden.signature,

          customer: {
            company: orden.customer.company,
            name: orden.customer.name,
            position: orden.customer.position,
            address: orden.customer.address
          },

          equipment: {
            year: orden.equipment.year,
            model: orden.equipment.model,
            serial_number: orden.equipment.serial_number
          }

        });

        this.workHours.clear();

        orden.work_hours.forEach((work: any) => {

          this.workHours.push(

            this.fb.group({

              id: [work.id],
              week: [work.week],
              date: [work.date],
              month: [work.month],

              trip: this.fb.group({
                start_trip: [work.trip.start_trip],
                arrival_trip: [work.trip.arrival_trip],
                out_departure: [work.trip.out_departure],
                out_arrival: [work.trip.out_arrival],
                travel_time: [work.trip.travel_time]
              }),

              work: this.fb.group({
                work_start: [work.work.work_start],
                work_finish: [work.work.work_finish],
                work_hours: [work.work.work_hours]
              }),

              comments: [work.comments]
            })
          );
        });

        this.ch.detectChanges();
      },

      error => {
        this.modal.cerrarModal();
        this.messages.mensajeGenerico('Ocurrió un error.', 'error', 'Error');
      }
    );
  }

  protected registrarOrden(): void {

    if (!this.idOrden && this.formOrden.invalid) {

      this.messages.mensajeGenerico('Aún hay campos vacíos o inválidos.', 'info',
        'Campos requeridos'
      );

      return;
    }

    this.messages.mensajeConfirmacionCustom(
      '¿Está seguro de registrar la orden?',
      'question', 'Registrar orden').then(res => {

      if (!res.isConfirmed) return;

      this.messages.mensajeEsperar();
      const datos = this.formOrden.getRawValue();
      const formData = new FormData();

      formData.append('id_order_type', datos.id_order_type);
      formData.append('module', datos.module);
      formData.append('place', datos.place);
      formData.append('final_goal', datos.final_goal);
      if (datos.signature) {formData.append('signature', datos.signature);}
      formData.append('customer', JSON.stringify(datos.customer));
      formData.append('equipment', JSON.stringify(datos.equipment));
      formData.append('work_hours', JSON.stringify(datos.work_hours));

      this.ordenes.registrarOrden(formData).toPromise().then((respuesta: any) => {
          this.messages.mensajeGenerico(respuesta.mensaje,'success',respuesta.title);
          this.modal.cerrarModal();
        })
        .catch(() => {
          this.messages.mensajeGenerico('Ocurrió un error.', 'error', 'Error');
        });
    });

  }

  get cambiosForm(): boolean {
    return this.formOrden.dirty;
  }

  public cerrarModal(): void {

    if (!this.cambiosForm) {

      this.modal.cerrarModal();
      return;

    }

    this.messages.mensajeConfirmacionCustom(
      '¿Está seguro de cerrar sin guardar cambios?', 'question', 'Cancelar registro').then(res => {

      if (!res.isConfirmed) return;

      this.modal.cerrarModal();
    });
  }
}