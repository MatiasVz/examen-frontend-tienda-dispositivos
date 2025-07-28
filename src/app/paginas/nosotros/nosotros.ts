import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Empleado {
  nombre: string;
  apellido: string;
  cargo: string;
  departamento: string;
  email: string;
  telefono: string;
  foto: string | null;
}

@Component({
  selector: 'app-nosotros',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './nosotros.html'
})
export class Nosotros implements OnInit {
  empleados: Empleado[] = [
    {
      nombre: 'Alejandro',
      apellido: 'Rodríguez',
      cargo: 'CEO & Fundador',
      departamento: 'Dirección Ejecutiva',
      email: 'arodriguez@techstore.com',
      telefono: '+593 98 456 7890',
      foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format'
    },
    {
      nombre: 'Sofía',
      apellido: 'Mendoza',
      cargo: 'Directora de Ventas',
      departamento: 'Comercial',
      email: 'smendoza@techstore.com',
      telefono: '+593 99 123 4567',
      foto: 'https://b2472105.smushcdn.com/2472105/wp-content/uploads/2023/09/Poses-Perfil-Profesional-Mujeres-ago.-10-2023-1-819x1024.jpg?lossy=1&strip=1&webp=1'
    },
    {
      nombre: 'Carlos',
      apellido: 'Vásquez',
      cargo: 'Jefe de Tecnología',
      departamento: 'IT & Desarrollo',
      email: 'cvasquez@techstore.com',
      telefono: '+593 97 890 1234',
      foto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format'
    },
    {
      nombre: 'Isabella',
      apellido: 'Torres',
      cargo: 'Especialista en Marketing',
      departamento: 'Marketing Digital',
      email: 'itorres@techstore.com',
      telefono: '+593 96 567 8901',
      foto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face&auto=format'
    },
    {
      nombre: 'Diego',
      apellido: 'Morales',
      cargo: 'Coordinador de Soporte',
      departamento: 'Atención al Cliente',
      email: 'dmorales@techstore.com',
      telefono: '+593 95 234 5678',
      foto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face&auto=format'
    },
    {
      nombre: 'Valentina',
      apellido: 'Castro',
      cargo: 'Analista Financiera',
      departamento: 'Finanzas',
      email: 'vcastro@techstore.com',
      telefono: '+593 94 789 0123',
      foto: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face&auto=format'
    }
  ];

  empleadoSeleccionado: Empleado | null = null;
  modoAgregar = false;
  modoEdicion = false;
  loading = false;

  constructor() {}

  ngOnInit(): void {}

  cargarEmpleados(): void {
    this.loading = true;
    // Simulación de carga de empleados
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }

  canManageEmpleados(): boolean {
    // Cambia esta lógica según tu control de acceso
    return true;
  }

  agregarEmpleado(): void {
    this.modoAgregar = true;
  }

  toggleModoEdicion(): void {
    this.modoEdicion = !this.modoEdicion;
  }

  cerrarDetalle(): void {
    this.empleadoSeleccionado = null;
  }

  verEmpleado(empleado: Empleado): void {
    this.empleadoSeleccionado = empleado;
  }
}