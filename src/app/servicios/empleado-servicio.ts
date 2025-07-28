import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Empleado } from '../modelos/Empleado';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoServicio {
  private urlApi = `${environment.urlApi}/empleados`;

  constructor(private http: HttpClient) {}

  getEmpleados(): Observable<Empleado[]> {
    return this.http.get<Empleado[]>(this.urlApi);
  }

  getEmpleado(id: number): Observable<Empleado> {
    return this.http.get<Empleado>(`${this.urlApi}/${id}`);
  }

  crearEmpleado(empleado: any): Observable<Empleado> {
    return this.http.post<Empleado>(this.urlApi, empleado);
  }

  actualizarEmpleado(id: number, empleado: any): Observable<Empleado> {
    return this.http.put<Empleado>(`${this.urlApi}/${id}`, empleado);
  }

  eliminarEmpleado(id: number): Observable<any> {
    return this.http.delete(`${this.urlApi}/${id}`);
  }
}