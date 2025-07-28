import { Routes } from '@angular/router';
import { Inicio } from './paginas/inicio/inicio';
import { Dispositivos } from './paginas/dispositivos/dispositivos';
import { Contactos } from './paginas/contactos/contactos';
import { Nosotros } from './paginas/nosotros/nosotros';
import { LoginComponent } from './login/login-component/login-component';
import { UsuarioComponent } from './admin/usuario-component/usuario-component';
import { EmpresaComponent } from './admin/empresa-component/empresa-component';

export const routes: Routes = [
  { path: '', component: Inicio },
  { path: 'dispositivos', component: Dispositivos },
  { path: 'contactos', component: Contactos },
  { path: 'nosotros', component: Nosotros },
  { path: 'login', component: LoginComponent },
  
  // Rutas administrativas (sin dashboard)
  { 
    path: 'admin/usuarios', 
    component: UsuarioComponent
  },
  { 
    path: 'admin/empresa', 
    component: EmpresaComponent
  },
  
  { path: '**', redirectTo: '' }
];