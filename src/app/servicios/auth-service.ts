import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8081/auth/login'; // ✅ URL CORRECTA según tu SecurityConfig
  private tipoUsuario$ = new BehaviorSubject<number | null>(this.getTipoUsuarioValor());
  private loggedIn$ = new BehaviorSubject<boolean>(this.isAuthenticated());

  constructor(private http: HttpClient, private router: Router) {}

  getTipoUsuario(): Observable<number | null> {
    return this.tipoUsuario$.asObservable();
  }

  getTipoUsuarioValor(): number | null {
    const tipoUsuario = localStorage.getItem('tipoUsuario');
    if (!tipoUsuario) return null;
    switch (tipoUsuario.toLowerCase()) {
      case 'admin': return 1;
      case 'usuario': return 2; // ✅ CAMBIADO: según tu DataLoader.java es "Usuario", no "Vendedor"
      default: return null;
    }
  }

  login(username: string, password: string): Observable<any> {
    return new Observable(observer => {
      this.http.post<any>(this.apiUrl, { username, password }).subscribe(
        res => {
          localStorage.setItem('token', res.token);
          localStorage.setItem('exp', res.exp);

          try {
            const payload = JSON.parse(atob(res.token.split('.')[1]));
            localStorage.setItem('tipoUsuario', payload.tipoUsuario);

            const tipo =
              payload.tipoUsuario?.toLowerCase() === 'admin' ? 1 :
              payload.tipoUsuario?.toLowerCase() === 'usuario' ? 2 : // ✅ CAMBIADO
              null;

            const usuario = {
              username: payload.sub,
              tipo,
              tipoUsuario: payload.tipoUsuario
            };

            localStorage.setItem('user', JSON.stringify(usuario));
            this.tipoUsuario$.next(usuario.tipo);
            this.loggedIn$.next(true);

            observer.next(res);
            observer.complete();
          } catch (error) {
            observer.error('Error al decodificar el token');
          }
        },
        err => observer.error(err)
      );
    });
  }

  logout(): void {
    localStorage.clear();
    this.loggedIn$.next(false);
    this.tipoUsuario$.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  authStatus(): Observable<boolean> {
    return this.loggedIn$.asObservable();
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn$.asObservable();
  }

  getUsername(): string {
    const user = this.getCurrentUser();
    return user && user.username ? user.username : '';
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser(): any {
    const user = localStorage.getItem('user');
    if (!user) return null;
    try {
      return JSON.parse(user);
    } catch {
      return null;
    }
  }

  getUserType(): number | null {
    return this.getTipoUsuarioValor();
  }

  isAdmin(): boolean {
    return this.getUserType() === 1;
  }

  isVendedor(): boolean {
    return this.getUserType() === 2;
  }
}

