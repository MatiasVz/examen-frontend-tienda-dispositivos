import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment';
import { Observable } from 'rxjs';
import { Empresa } from '../modelos/Empresa';

@Injectable({
  providedIn: 'root'
})
export class EmpresaServicio {

  private urlApiEmpresa = `${environment.urlApi}/empresa`;

  constructor(private http: HttpClient) {}

  getEmpresa(): Observable<Empresa> {
    return this.http.get<Empresa>(this.urlApiEmpresa);
  }

  updateEmpresa(id: number, empresaDTO: any): Observable<Empresa> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<Empresa>(`${this.urlApiEmpresa}/${id}`, empresaDTO, { headers });
  }
}
