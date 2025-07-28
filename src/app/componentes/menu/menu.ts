import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../servicios/auth-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './menu.html',
  styleUrls: ['./menu.css']
})
export class MenuComponent implements OnInit, OnDestroy {
  // Propiedades que usa el template
  isLoggedIn = false;
  username = '';
  userType: number | null = null;
  
  private authSubscription: Subscription = new Subscription();

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Suscribirse a los cambios de autenticación
    this.authSubscription = this.authService.isLoggedIn().subscribe(isLogged => {
      this.isLoggedIn = isLogged;
      if (isLogged) {
        this.username = this.authService.getUsername();
        this.userType = this.authService.getUserType();
      } else {
        this.username = '';
        this.userType = null;
      }
    });
  }

  ngOnDestroy() {
    // Limpiar suscripción para evitar memory leaks
    this.authSubscription.unsubscribe();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  getUserTypeLabel(): string {
    switch (this.userType) {
      case 1:
        return 'ADMIN';
      case 2:
        return 'VENDEDOR';
      case 3:
        return 'USUARIO';
      default:
        return '';
    }
  }

  // Métodos para verificar permisos (que usa el template)
  isAdmin(): boolean {
    return this.userType === 1;
  }

  isVendedor(): boolean {
    return this.userType === 2;
  }

  isUsuario(): boolean {
    return this.userType === 3;
  }

  canAccessAdmin(): boolean {
    return this.userType === 1; // Solo admin
  }

  canManageProducts(): boolean {
    return this.userType === 1 || this.userType === 2; // Admin y Vendedor
  }
}