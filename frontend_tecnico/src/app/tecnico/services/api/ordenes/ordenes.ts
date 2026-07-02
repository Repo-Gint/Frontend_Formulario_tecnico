import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { api } from '../../../../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class OrdenesService {
  constructor(
    private http: HttpClient
  ) {}

  public registrarOrden(formData: FormData): Observable<any> {
    return this.http.post<any>(`${api}/ordenes/registrarOrden`, formData);
  }

  public obtenerStatusOrdenes(): Observable<any> {
    return this.http.get<any>(`${api}/ordenes/obtenerStatusOrdenes`);
  }

  public obtenerListaGeneralOrdenes(data: any): Observable<any> {
    return this.http.post<any>(`${api}/ordenes/obtenerListaGeneralOrdenes`, data);
  }

  public obtenerDetalleOrden($pkOrden: number): Observable<any> {
    return this.http.get<any>(`${api}/ordenes/obtenerDetalleOrden/${$pkOrden}`,);
  }

  public actualizarOrden(formData: FormData): Observable<any> {
    return this.http.post<any>(`${api}/ordenes/actualizarOrden`, formData);
  }

  public cancelarOrden(id: number): Observable<any> {
    return this.http.post<any>(`${api}/ordenes/cancelar/${id}`, {});
  }

}
