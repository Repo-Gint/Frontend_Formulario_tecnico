import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { api } from '../../../../../environments/environments';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  constructor(
    private http: HttpClient
  ) {}

  public cerrarSesion(): Observable<any> {
		return this.http.post<any>(`${api}/usuarios/cerrarSesion`, {});
	}
}
