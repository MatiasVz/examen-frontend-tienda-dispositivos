import { CanActivate, Router, ActivatedRouteSnapshot } from "@angular/router";
import { AuthService } from "../servicios/auth-service";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    // ✅ CORRECCIÓN: Usar isAuthenticated() en vez de isLoggedIn()
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }

    const userType = this.auth.getUserType();
    const routePath = route.routeConfig?.path;

    // Rutas permitidas para vendedor (tipo 2)
    const vendedorRoutes = ['inicio', 'dispositivos', 'contactos', 'nosotros', ''];

    if (userType === 2) {
      if (routePath && (vendedorRoutes.includes(routePath) || routePath === '')) {
        return true;
      }
      this.router.navigate(['/']);
      return false;
    }

    if (userType === 1) {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}
