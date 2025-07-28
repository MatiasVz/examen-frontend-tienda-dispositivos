import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FooterServicio {
  private urlApiFooter = 'http://localhost:8081/footers';
  private urlApiRedSocial = 'http://localhost:8081/redes-sociales';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (token) {
      return new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });
    }
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  // CAMBIO: Headers públicos sin autenticación para consultas públicas
  private getPublicHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  // ===== MÉTODOS FOOTER PÚBLICOS =====
  getFooters(): Observable<any[]> {
    // CAMBIO: Usar headers públicos para que funcione sin autenticación
    return this.http.get<any[]>(this.urlApiFooter, { headers: this.getPublicHeaders() }).pipe(
      catchError(err => {
        console.warn('Error al cargar footers:', err);
        return of([]);
      })
    );
  }

  getFooterPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.urlApiFooter}/${id}`, { headers: this.getPublicHeaders() });
  }

  getUltimoFooter(): Observable<any> {
    return new Observable(observer => {
      this.getFooters().subscribe(footers => {
        if (footers && footers.length > 0) {
          const ultimoFooter = footers[footers.length - 1];
          observer.next(ultimoFooter);
          observer.complete();
        } else {
          observer.error('No hay footers disponibles');
        }
      });
    });
  }

  // ===== MÉTODOS FOOTER ADMIN (requieren autenticación) =====
  crearFooter(footerDTO: any): Observable<any> {
    return this.http.post<any>(this.urlApiFooter, footerDTO, { headers: this.getAuthHeaders() });
  }

  actualizarFooter(id: number, footerDTO: any): Observable<any> {
    return this.http.put<any>(`${this.urlApiFooter}/${id}`, footerDTO, { headers: this.getAuthHeaders() });
  }

  eliminarFooter(id: number): Observable<any> {
    return this.http.delete<any>(`${this.urlApiFooter}/${id}`, { headers: this.getAuthHeaders() });
  }

  // ===== MÉTODOS RED SOCIAL PÚBLICOS =====
  getRedesSociales(): Observable<any[]> {
    // CAMBIO: Usar headers públicos para que funcione sin autenticación
    return this.http.get<any[]>(this.urlApiRedSocial, { headers: this.getPublicHeaders() }).pipe(
      catchError(err => {
        console.warn('Error al cargar redes sociales:', err);
        return of([]);
      })
    );
  }

  getRedSocialPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.urlApiRedSocial}/${id}`, { headers: this.getPublicHeaders() });
  }

  getUltimaRedSocial(): Observable<any> {
    return new Observable(observer => {
      this.getRedesSociales().subscribe(redes => {
        if (redes && redes.length > 0) {
          const ultimaRed = redes[redes.length - 1];
          observer.next(ultimaRed);
          observer.complete();
        } else {
          observer.error('No hay redes sociales disponibles');
        }
      });
    });
  }

  getRedesSocialesPorFooter(footerId: number): Observable<any[]> {
    // CAMBIO: Usar headers públicos para que funcione sin autenticación
    return this.http.get<any[]>(`${this.urlApiFooter}/${footerId}/redes-sociales`, { headers: this.getPublicHeaders() }).pipe(
      catchError(err => {
        console.warn('Error al cargar redes sociales por footer:', err);
        return of([]);
      })
    );
  }

  // ===== MÉTODOS RED SOCIAL ADMIN (requieren autenticación) =====
  crearRedSocial(redDTO: any): Observable<any> {
    return this.http.post<any>(this.urlApiRedSocial, redDTO, { headers: this.getAuthHeaders() });
  }

  actualizarRedSocial(id: number, redDTO: any): Observable<any> {
    return this.http.put<any>(`${this.urlApiRedSocial}/${id}`, redDTO, { headers: this.getAuthHeaders() });
  }

  eliminarRedSocial(id: number): Observable<any> {
    return this.http.delete<any>(`${this.urlApiRedSocial}/${id}`, { headers: this.getAuthHeaders() });
  }
}