import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

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
  tiposSeleccionados: any[] = [];

  @ViewChild('sigCanvas')
  sigCanvas!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;

  protected formOrden!: FormGroup;
  protected listatipoOrden: any[] = [];
  protected listafechas: any[] = [];
  protected tipoOrdenSeleccionado: any = { id_type_order: null, type_order: '' };

  protected ordenesUsuario: any[] = [];

  constructor(
    private modal: ModalService,
    private messages: MessagesService,
    private ordenes: OrdenesService,
    private fb: FormBuilder,
    private ch: ChangeDetectorRef
  ) { }

  get semanas(): FormArray {
    return this.formOrden.get('semanas') as FormArray;
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

  removeWorkHour(index: number): void {
    this.workHours.removeAt(index);
  }

  addWorkHour(): void {
    this.workHours.push(
      this.fb.group({
        id: [''],
        week: [''],
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
      })
    );
  }

  async ngOnInit(): Promise<any> {

    console.log('ID RECIBIDO:', this.idOrden);

    this.messages.mensajeEsperar();

    this.crearFormOrden();
    this.agregarWorkHour();

    await this.obtenerRecursosRegistroOrden();

    if (this.idOrden != null) {
      console.log('VOY A CONSULTAR EL DETALLE');
      await this.obtenerDetalleOrden(this.idOrden);
    }

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

    if (event.target.checked) {
      updated.push(tipo.id_type_order);
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
      module: [''],
      place: [''],

      customer: this.fb.group({
        company: [''],
        customer: [''],
        position: [''],
        email_customer: [''],
        address: ['']
      }),

      equipment: this.fb.group({
        year: [''],
        model: [''],
        serial_number: [''],
        work_hours_total: ['']
      }),

      final_goal: [''],
      signature: [null],
      date:[''],

      semanas: this.fb.array([]),

      work_hours: this.fb.array([]),

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

        id: [''],
        week: [''],
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
      })
    );
  }

  public async obtenerRecursosRegistroOrden(): Promise<void> {
    try {
      const respuesta: any = await this.ordenes.obtenerRecursosRegistroOrden().toPromise();

      this.listatipoOrden = respuesta.recursos.listatipoOrden;
      this.listafechas = respuesta.recursos.listafechas;

      this.ch.detectChanges();
    } catch (error) {
      this.messages.mensajeGenerico('error', 'error');
    }
  }

  public async obtenerDetalleOrden(idOrden: string): Promise<void> {
    console.log('ENTRÓ A obtenerDetalleOrden');
    console.log('ID:', idOrden);

    return this.ordenes.obtenerDetalleOrden(idOrden).toPromise().then(

      respuesta => {
        console.log(respuesta);
        const orden = respuesta.orden;

        this.formOrden.patchValue({

          id_type_order: orden.id_type_order
            ? orden.id_type_order.split(',')
            : [],
          module: orden.module,
          enginner: orden.enginner,
          place: orden.place,
          id_status_order: orden.id_status_order,
          final_goal: orden.final_goal,
          signature: orden.signature,
          date: orden.created_at 
            ? orden.created_at.substring(0,10)
            : '',

          customer: {
            company: orden.customer.company,
            customer: orden.customer.customer,
            position: orden.customer.position,
            email_customer: orden.customer.email_customer,
            address: orden.customer.address
          },

          equipment: {
            year: orden.equipment.year,
            model: orden.equipment.model,
            serial_number: orden.equipment.serial_number,
            work_hours_total: orden.equipment.work_hours_total
          }

        });

        this.tiposSeleccionados = orden.id_type_order
          ? orden.id_type_order.split(',').map((id: string) => id.toString())
          : [];

        this.semanas.clear();

        const semanasAgrupadas: any = {};

        orden.work_hours.forEach((work: any) => {
          const semana = work.week;
          if (!semanasAgrupadas[semana]) {
            semanasAgrupadas[semana] = {
              comments: work.comments || '',
              dias: []
            };
          }
          semanasAgrupadas[semana].dias.push(work);
        });

        Object.keys(semanasAgrupadas).forEach((key: any) => {
          const semanaData = semanasAgrupadas[key];
          this.semanas.push(
            this.fb.group({
              comments: [semanaData.comments],
              dias: this.fb.array(

                semanaData.dias.map((dia: any) =>
                  this.fb.group({ id: [dia.id || null],
                    date: [dia.date],
                    month: [dia.month],
                    trip: this.fb.group({
                      start_trip: [dia.trip?.start_trip],
                      arrival_trip: [dia.trip?.arrival_trip],
                      out_departure: [dia.trip?.out_departure],
                      out_arrival: [dia.trip?.out_arrival],
                      travel_time: [dia.trip?.travel_time]
                    }),

                    work: this.fb.group({
                      work_start: [dia.work?.work_start],
                      work_finish: [dia.work?.work_finish],
                      work_hours: [dia.work?.work_hours]
                    })
                  })
                )
              )
            })
          );
        });

        this.ch.detectChanges();
        if (orden.signature) {
  this.cargarFirma(orden.signature);
}
      },

      error => {
        this.modal.cerrarModal();
        this.messages.mensajeGenerico('Ocurrió un error.', 'error', 'Error');
      }
    );
  }

  protected actualizarOrden(): void {


    this.messages.mensajeConfirmacionCustom(
        '¿Está seguro de actualizar la orden?',
        'question',
        'Actualizar orden'
    ).then(res => {

        if (!res.isConfirmed) return;
        this.messages.mensajeEsperar();
        const datos = this.formOrden.getRawValue();
        const workHours = (datos.semanas || []).flatMap(
            (semana:any, index:number)=>{
            return (semana.dias || []).map((dia:any)=>({
                id: dia.id || null,
                week: index + 1,
                date: dia.date,
                month: dia.month,
                trip:{
                    start_trip: dia.trip?.start_trip,
                    arrival_trip: dia.trip?.arrival_trip,
                    out_departure: dia.trip?.out_departure,
                    out_arrival: dia.trip?.out_arrival,
                    travel_time: dia.trip?.travel_time
                },
                work:{
                    work_start: dia.work?.work_start,
                    work_finish: dia.work?.work_finish,
                    work_hours: dia.work?.work_hours
                },
                comments: semana.comments || ''
            }));
        });

        const formData = new FormData();
        formData.append('id', this.idOrden);
        formData.append('id_type_order', Array.isArray(datos.id_type_order)
                ? datos.id_type_order.join(',')
                : String(datos.id_type_order ?? ''));
        formData.append('module', datos.module ?? '');
        formData.append( 'enginner', datos.enginner ?? '');
        formData.append('place',datos.place ?? '');
        formData.append('customer', JSON.stringify(datos.customer ?? {}));
        formData.append('equipment', JSON.stringify(datos.equipment ?? {}));
        formData.append('work_hours',  JSON.stringify(workHours));
        formData.append('final_goal', datos.final_goal ?? '');
        formData.append('signature', datos.signature ?? '');
        formData.append('id_status_order', String(datos.id_status_order ?? 1));

        this.ordenes.actualizarOrden(formData).subscribe({
            next:(respuesta:any)=>{
                this.messages.mensajeGenerico(
                    respuesta.mensaje,
                    'success',
                    respuesta.title
                );
                this.obtenerDetalleOrden(this.idOrden);
            },
            error:(error)=>{
                console.error(error);
                this.messages.mensajeGenerico(
                    'Ocurrió un error.',
                    'error',
                    'Error'
                );
            }
        });
    });

}

  private cargarFirma(firma: string): void {
  const canvas = this.sigCanvas.nativeElement;
  const ctx = canvas.getContext('2d');
  const imagen = new Image();
  imagen.onload = () => {
    ctx?.clearRect(0, 0, canvas.width, canvas.height);

    ctx?.drawImage(imagen, 0, 0, canvas.width, canvas.height);
  };
  imagen.src = firma;
}

  protected registrarOrden(): void {

    if (!this.idOrden && this.formOrden.invalid) {
      this.messages.mensajeGenerico(
        'Aún hay campos vacíos o inválidos.',
        'info',
        'Campos requeridos'
      );
      return;
    }

    this.messages.mensajeConfirmacionCustom(
      '¿Está seguro de registrar la orden?',
      'question',
      'Registrar orden'
    ).then(res => {

      if (!res.isConfirmed) return;

      this.messages.mensajeEsperar();
      // Firma
      const firma = this.sigCanvas.nativeElement.toDataURL('image/png');
      this.formOrden.patchValue({ signature: firma });
      // Datos reales del form
      const datos = this.formOrden.getRawValue();
      const workHours = (datos.semanas || []).flatMap((semana: any, index: number) => {
        const comentarioSemana = semana.comments || '';
        return (semana.dias || []).map((dia: any) => ({
          id: dia.id || null,
          week: index + 1,
          date: dia.date,
          month: dia.month,

          trip: {
            start_trip: dia.trip?.start_trip,
            arrival_trip: dia.trip?.arrival_trip,
            out_departure: dia.trip?.out_departure,
            out_arrival: dia.trip?.out_arrival,
            travel_time: dia.trip?.travel_time,
          },

          work: {
            work_start: dia.work?.work_start,
            work_finish: dia.work?.work_finish,
            work_hours: dia.work?.work_hours,
          },

          comments: comentarioSemana
        }));
      });

      const formData = new FormData();

      formData.append(
        'id_order_type',
        Array.isArray(datos.id_order_type)
          ? datos.id_order_type.join(',')
          : String(datos.id_order_type ?? '')
      );

      formData.append('enginner', datos.enginner ?? '');
      formData.append('module', datos.module ?? '');
      formData.append('place', datos.place ?? '');
      formData.append('id_status_order', String(datos.id_status_order ?? 1));
      formData.append('final_goal', datos.final_goal ?? '');
      formData.append('customer', JSON.stringify(datos.customer ?? {}));
      formData.append('equipment', JSON.stringify(datos.equipment ?? {}));
      formData.append('work_hours', JSON.stringify(workHours));
      formData.append('signature', datos.signature ?? '');
      formData.append('started_by', datos.started_by ?? '');
      formData.append('start_date', datos.start_date ?? '');
      formData.append('cancelled_by', datos.cancelled_by ?? '');
      formData.append('cancelled_at', datos.cancelled_at ?? '');
      formData.append('finished_by', datos.finished_by ?? '');
      formData.append('finished_at', datos.finished_at ?? '');

      this.ordenes.registrarOrden(formData).subscribe({

        next: (respuesta: any) => {

          this.messages.mensajeGenerico(
            respuesta.mensaje, 'success', respuesta.title);
          this.modal.cerrarModal();
        },

        error: (error) => {
          console.error(error);
          this.messages.mensajeGenerico('Ocurrió un error.', 'error', 'Error');
        }
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