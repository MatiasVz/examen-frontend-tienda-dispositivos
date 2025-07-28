import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment';
import { Dispositivo } from '../modelos/Dispositivo';
import { AuthService } from './auth-service'; // Asegúrate que la ruta sea correcta

@Injectable({
  providedIn: 'root'
})
export class DispositivoServicio {
  private urlApi = 'http://localhost:8081/dispositivo';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  actualizarDispositivo(id: number, dispositivo: any): Observable<Dispositivo> {
    const headers = this.getAuthHeaders();
    return this.http.put<Dispositivo>(
      `${this.urlApi}/${id}`,
      dispositivo,
      { headers }
    );
  }

  crearDispositivo(dispositivo: Dispositivo): Observable<Dispositivo> {
    return this.http.post<Dispositivo>(
      this.urlApi,
      dispositivo,
      { headers: this.getAuthHeaders() }
    );
  }

  eliminarDispositivo(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.urlApi}/${id}`,
      { headers: this.getAuthHeaders() }
    );
  }

  getDispositivos(): Observable<Dispositivo[]> {
    return this.http.get<Dispositivo[]>(this.urlApi);
    // Si tu backend requiere autenticación para GET, usa: { headers: this.getAuthHeaders() }
  }
}