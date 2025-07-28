import { Component, OnInit, OnDestroy } from '@angular/core';
import { Dispositivo } from '../../modelos/Dispositivo';
import { DispositivoServicio } from '../../servicios/dispositivo-servicio';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../servicios/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dispositivos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dispositivos.html'
})
export class Dispositivos implements OnInit, OnDestroy {
  dispositivos: Dispositivo[] = [];
  currentPage = 0;
  itemsPerPage = 4;
  dispositivosPaginados: Dispositivo[] = [];
  currentDispositivo: Dispositivo | null = null;

  bannerIndex = 0;
  bannerInterval: any;

  modoEdicion = false;
  modoAgregar = false;
  dispositivoEditando: Dispositivo | null = null;
  nuevoDispositivo: Dispositivo = this.inicializarNuevoDispositivo();
  tipoUsuario: number | null = null;

  filtros = {
    categoria: '',
    marca: '',
    modelo: '',
    precioRango: ''
  };

  categoriasDisponibles: string[] = [];
  marcasDisponibles: string[] = [];
  rangosPrecio: string[] = [
    'Menos de $500',
    '$500 - $1000',
    '$1000 - $2000',
    'Más de $2000'
  ];

  constructor(
    private dispositivoServicio: DispositivoServicio,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.dispositivoServicio.getDispositivos().subscribe((data: Dispositivo[]) => {
      this.dispositivos = data;
      this.generarOpcionesFiltros();
      this.aplicarFiltros();
    });
    this.authService.getTipoUsuario().subscribe((tipo: number | null) => {
      this.tipoUsuario = tipo ?? 0; // Si es null, asigna 0 (o el valor que prefieras)
    });
  }

  ngOnDestroy(): void {
    this.stopBanner();
  }

  inicializarNuevoDispositivo(): Dispositivo {
    return {
      secuencial: 0,
      nombre: '',
      categoria: '',
      marca: '',
      modelo: '',
      descripcion: '',
      precio: 0,
      stock: 0,
      estado: 1,
      imagenes: []
    };
  }

  aplicarFiltros(): void {
    let filtrados = this.dispositivos.filter(d => {
      const precio = d.precio || 0;
      let cumplePrecio = true;
      switch (this.filtros.precioRango) {
        case 'Menos de $500':
          cumplePrecio = precio < 500;
          break;
        case '$500 - $1000':
          cumplePrecio = precio >= 500 && precio <= 1000;
          break;
        case '$1000 - $2000':
          cumplePrecio = precio > 1000 && precio <= 2000;
          break;
        case 'Más de $2000':
          cumplePrecio = precio > 2000;
          break;
      }
      return (
        (!this.filtros.categoria || d.categoria === this.filtros.categoria) &&
        (!this.filtros.marca || d.marca === this.filtros.marca) &&
        (!this.filtros.modelo || d.modelo?.toLowerCase().includes(this.filtros.modelo.toLowerCase())) &&
        cumplePrecio
      );
    });
    this.dispositivosPaginados = filtrados.slice(
      this.currentPage * this.itemsPerPage,
      (this.currentPage + 1) * this.itemsPerPage
    );
  }

  generarOpcionesFiltros(): void {
    this.categoriasDisponibles = [...new Set(this.dispositivos.map(d => d.categoria))];
    this.marcasDisponibles = [...new Set(this.dispositivos.map(d => d.marca))];
  }

  stopBanner(): void {
    if (this.bannerInterval) {
      clearInterval(this.bannerInterval);
      this.bannerInterval = null;
    }
  }

  iniciarBanner(): void {
    this.stopBanner();
    this.bannerInterval = setInterval(() => {
      this.bannerIndex = (this.bannerIndex + 1) % this.nuevoDispositivo.imagenes.length;
    }, 3000);
  }

  abrirCerrarModalAgregar(): void {
    this.modoAgregar = !this.modoAgregar;
    if (this.modoAgregar) {
      this.nuevoDispositivo = this.inicializarNuevoDispositivo();
    }
  }

  agregarDispositivo(): void {
    this.dispositivoServicio.crearDispositivo(this.nuevoDispositivo).subscribe((dispositivo: Dispositivo) => {
      this.dispositivos.push(dispositivo);
      this.generarOpcionesFiltros();
      this.aplicarFiltros();
      this.abrirCerrarModalAgregar();
    });
  }

  abrirCerrarModalEditar(dispositivo: Dispositivo | null): void {
    this.modoEdicion = !this.modoEdicion;
    if (this.modoEdicion && dispositivo) {
      this.dispositivoEditando = { ...dispositivo };
    } else {
      this.dispositivoEditando = null;
    }
  }

  editarDispositivo(): void {
    if (this.dispositivoEditando && this.dispositivoEditando.secuencial) {
      const dispositivoAdaptado: any = {
        nombre: this.dispositivoEditando.nombre,
        categoria: this.dispositivoEditando.categoria,
        marca: this.dispositivoEditando.marca,
        modelo: this.dispositivoEditando.modelo,
        descripcion: this.dispositivoEditando.descripcion,
        precio: this.dispositivoEditando.precio,
        stock: this.dispositivoEditando.stock,
        estado: this.dispositivoEditando.estado,
        imagenes: this.dispositivoEditando.imagenes.map(img => img.url)
      };
      this.dispositivoServicio.actualizarDispositivo(
        this.dispositivoEditando.secuencial,
        dispositivoAdaptado // usa any aquí
      ).subscribe((dispositivoActualizado: Dispositivo) => {
        const index = this.dispositivos.findIndex(d => d.secuencial === dispositivoActualizado.secuencial);
        if (index !== -1) {
          this.dispositivos[index] = dispositivoActualizado;
          this.generarOpcionesFiltros();
          this.aplicarFiltros();
          this.modoEdicion = false;
          this.dispositivoEditando = null;
        }
      });
    }
  }

  eliminarDispositivo(dispositivo: Dispositivo): void {
    this.dispositivoServicio.eliminarDispositivo(dispositivo.secuencial).subscribe(() => {
      this.dispositivos = this.dispositivos.filter(d => d.secuencial !== dispositivo.secuencial);
      this.generarOpcionesFiltros();
      this.aplicarFiltros();
    });
  }

  cambiarEstado(dispositivo: Dispositivo, estado: number): void {
    const actualizado = { ...dispositivo, estado };
    this.dispositivoServicio.actualizarDispositivo(actualizado.secuencial, actualizado).subscribe((dispositivoResp: Dispositivo) => {
      const index = this.dispositivos.findIndex(d => d.secuencial === dispositivoResp.secuencial);
      if (index !== -1) {
        this.dispositivos[index] = dispositivoResp;
        this.generarOpcionesFiltros();
        this.aplicarFiltros();
      }
    });
  }

  paginar(incremento: number): void {
    this.currentPage += incremento;
    this.aplicarFiltros();
  }

  irAPagina(page: number): void {
    this.currentPage = page;
    this.aplicarFiltros();
  }

  obtenerRango(): number[] {
    const totalItems = this.dispositivos.filter(d => {
      const precio = d.precio || 0;
      let cumplePrecio = true;
      switch (this.filtros.precioRango) {
        case 'Menos de $500':
          cumplePrecio = precio < 500;
          break;
        case '$500 - $1000':
          cumplePrecio = precio >= 500 && precio <= 1000;
          break;
        case '$1000 - $2000':
          cumplePrecio = precio > 1000 && precio <= 2000;
          break;
        case 'Más de $2000':
          cumplePrecio = precio > 2000;
          break;
      }
      return (
        (!this.filtros.categoria || d.categoria === this.filtros.categoria) &&
        (!this.filtros.marca || d.marca === this.filtros.marca) &&
        (!this.filtros.modelo || d.modelo?.toLowerCase().includes(this.filtros.modelo.toLowerCase())) &&
        cumplePrecio
      );
    }).length;
    const totalPages = Math.ceil(totalItems / this.itemsPerPage);
    return Array.from({ length: totalPages }, (_, i) => i);
  }

  esPrimeraPagina(): boolean {
    return this.currentPage === 0;
  }

  esUltimaPagina(): boolean {
    const totalItems = this.dispositivos.filter(d => {
      const precio = d.precio || 0;
      let cumplePrecio = true;
      switch (this.filtros.precioRango) {
        case 'Menos de $500':
          cumplePrecio = precio < 500;
          break;
        case '$500 - $1000':
          cumplePrecio = precio >= 500 && precio <= 1000;
          break;
        case '$1000 - $2000':
          cumplePrecio = precio > 1000 && precio <= 2000;
          break;
        case 'Más de $2000':
          cumplePrecio = precio > 2000;
          break;
      }
      return (
        (!this.filtros.categoria || d.categoria === this.filtros.categoria) &&
        (!this.filtros.marca || d.marca === this.filtros.marca) &&
        (!this.filtros.modelo || d.modelo?.toLowerCase().includes(this.filtros.modelo.toLowerCase())) &&
        cumplePrecio
      );
    }).length;
    return (this.currentPage + 1) * this.itemsPerPage >= totalItems;
  }

  irAInicio(): void {
    this.currentPage = 0;
    this.aplicarFiltros();
  }

  irAlFinal(): void {
    const totalItems = this.dispositivos.filter(d => {
      const precio = d.precio || 0;
      let cumplePrecio = true;
      switch (this.filtros.precioRango) {
        case 'Menos de $500':
          cumplePrecio = precio < 500;
          break;
        case '$500 - $1000':
          cumplePrecio = precio >= 500 && precio <= 1000;
          break;
        case '$1000 - $2000':
          cumplePrecio = precio > 1000 && precio <= 2000;
          break;
        case 'Más de $2000':
          cumplePrecio = precio > 2000;
          break;
      }
      return (
        (!this.filtros.categoria || d.categoria === this.filtros.categoria) &&
        (!this.filtros.marca || d.marca === this.filtros.marca) &&
        (!this.filtros.modelo || d.modelo?.toLowerCase().includes(this.filtros.modelo.toLowerCase())) &&
        cumplePrecio
      );
    }).length;
    this.currentPage = Math.max(Math.ceil(totalItems / this.itemsPerPage) - 1, 0);
    this.aplicarFiltros();
  }

  agregarImagenNuevoDispositivo(): void {
    this.nuevoDispositivo.imagenes.push({ url: '' });
  }

  quitarImagenNuevoDispositivo(index: number): void {
    this.nuevoDispositivo.imagenes.splice(index, 1);
  }

  verDispositivo(dispositivo: Dispositivo): void {
    this.currentDispositivo = dispositivo;
    this.bannerIndex = 0;
  }

  limpiarFiltros(): void {
    this.filtros = {
      categoria: '',
      marca: '',
      modelo: '',
      precioRango: ''
    };
    this.currentPage = 0;
    this.aplicarFiltros();
  }
}