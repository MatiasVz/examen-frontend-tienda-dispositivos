import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../servicios/auth-service';
import { FooterServicio } from '../../servicios/footer-servicio';

declare var bootstrap: any;

@Component({
  selector: 'app-pie-pagina',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule],
  templateUrl: './pie-pagina.html'
})
export class PiePagina implements OnInit {
  footer: any = null;
  redesSociales: any[] = [];
  isAdmin: boolean = false;
  currentYear: number = new Date().getFullYear();
  
  // Lista de todas las redes sociales disponibles para editar
  todasLasRedesSociales: any[] = [];
  redSocialSeleccionada: any = null;

  // Datos para nuevo footer
  nuevoFooter: { descripcion: string; telefono: string; ano: number; empresaId: number } = {
    descripcion: '',
    telefono: '',
    ano: this.currentYear,
    empresaId: 1
  };

  // Datos para editar footer
  footerEdit: { id?: number; descripcion: string; telefono: string; ano: number; empresaId: number } = {
    id: undefined,
    descripcion: '',
    telefono: '',
    ano: this.currentYear,
    empresaId: 1
  };

  // Datos para nueva red social
  nuevaRedSocial: { nombre: string; url: string; footerId: number } = {
    nombre: '',
    url: '',
    footerId: 1
  };

  // Datos para editar red social
  redSocialEdit: { id?: number; nombre: string; url: string; footerId: number } = {
    id: undefined,
    nombre: '',
    url: '',
    footerId: 1
  };

  constructor(private authService: AuthService, private footerServicio: FooterServicio) {}

  ngOnInit() {
    this.isAdmin = this.authService.isAdmin();
    
    // CAMBIO: Cargar footer siempre, no solo cuando está autenticado
    this.cargarFooter();
  }

  cargarFooter() {
    this.footerServicio.getFooters().subscribe({
      next: (footers: any[]) => {
        if (footers && footers.length > 0) {
          this.footer = footers[footers.length - 1];
          this.cargarRedesSociales();
        } else {
          // CAMBIO: Si no hay footers, usar valores por defecto
          this.footer = {
            descripcion: 'Tu tienda de tecnología de confianza',
            telefono: 'Teléfono no disponible',
            ano: this.currentYear,
            empresa: {
              nombreComercial: 'TechStore'
            }
          };
          // CAMBIO: También cargar redes sociales por defecto
          this.cargarRedesSocialesPorDefecto();
        }
      },
      error: (err) => {
        console.error('Error al cargar footers:', err);
        // En caso de error, usar valores por defecto
        this.footer = {
          descripcion: 'Tu tienda de tecnología de confianza',
          telefono: 'Teléfono no disponible',
          ano: this.currentYear,
          empresa: {
            nombreComercial: 'TechStore'
          }
        };
        // CAMBIO: También cargar redes sociales por defecto en caso de error
        this.cargarRedesSocialesPorDefecto();
      }
    });
  }

  cargarRedesSociales() {
    if (this.footer && this.footer.id) {
      this.footerServicio.getRedesSocialesPorFooter(this.footer.id).subscribe({
        next: (redes: any[]) => {
          if (redes && redes.length > 0) {
            this.redesSociales = redes;
          } else {
            // Si no hay redes sociales en BD, usar por defecto
            this.cargarRedesSocialesPorDefecto();
          }
          this.nuevaRedSocial.footerId = this.footer.id;
        },
        error: (err) => {
          console.error('Error al cargar redes sociales:', err);
          // En caso de error, usar redes sociales por defecto
          this.cargarRedesSocialesPorDefecto();
        }
      });
    } else {
      // Si no hay footer con ID, usar redes sociales por defecto
      this.cargarRedesSocialesPorDefecto();
    }
  }

  // NUEVO MÉTODO: Cargar redes sociales por defecto
  private cargarRedesSocialesPorDefecto() {
    this.redesSociales = [
      { nombre: 'facebook', url: 'https://facebook.com' },
      { nombre: 'twitter', url: 'https://twitter.com' },
      { nombre: 'instagram', url: 'https://instagram.com' },
      { nombre: 'linkedin', url: 'https://linkedin.com' }
    ];
  }

  // ===== MÉTODOS FOOTER =====
  guardarFooter() {
    this.footerServicio.crearFooter(this.nuevoFooter).subscribe({
      next: (footer: any) => {
        alert('Footer guardado exitosamente');
        this.nuevoFooter = { descripcion: '', telefono: '', ano: this.currentYear, empresaId: 1 };
        this.footer = footer;
        this.cerrarModal('footerModal');
        this.cargarRedesSociales();
      },
      error: (err: any) => {
        alert('Error al guardar el footer: ' + (err.error?.message || err.message));
        console.error(err);
      }
    });
  }

  abrirEditarFooter() {
    if (this.footer) {
      this.footerEdit = {
        id: this.footer.id,
        descripcion: this.footer.descripcion,
        telefono: this.footer.telefono,
        ano: this.footer.ano,
        empresaId: this.footer.empresa?.secuencial ?? 1
      };
      this.cerrarModal('modificarBannerModal');
      this.abrirModal('editarFooterModal');
    } else {
      alert('No hay footer disponible para editar');
    }
  }

  actualizarFooter() {
    if (!this.footerEdit.id) {
      alert('No se puede actualizar: ID de footer no válido');
      return;
    }

    const footerDTO = {
      descripcion: this.footerEdit.descripcion,
      telefono: this.footerEdit.telefono,
      ano: this.footerEdit.ano,
      empresaId: this.footerEdit.empresaId
    };

    this.footerServicio.actualizarFooter(this.footerEdit.id, footerDTO).subscribe({
      next: (footer: any) => {
        alert('Footer actualizado exitosamente');
        this.footer = { ...this.footer, ...footerDTO };
        this.cerrarModal('editarFooterModal');
      },
      error: (err: any) => {
        alert('Error al actualizar el footer: ' + (err.error?.message || err.message));
        console.error(err);
      }
    });
  }

  // ===== MÉTODOS RED SOCIAL =====
  guardarRedSocial() {
    this.footerServicio.crearRedSocial(this.nuevaRedSocial).subscribe({
      next: (red: any) => {
        alert('Red social guardada exitosamente');
        this.nuevaRedSocial = { nombre: '', url: '', footerId: this.footer?.id ?? 1 };
        this.cargarRedesSociales();
        this.cerrarModal('redSocialModal');
      },
      error: (err: any) => {
        alert('Error al guardar la red social: ' + (err.error?.message || err.message));
        console.error(err);
      }
    });
  }

  abrirEditarRedSocial() {
    this.footerServicio.getRedesSociales().subscribe({
      next: (redes: any[]) => {
        this.todasLasRedesSociales = redes;
        this.redSocialSeleccionada = null;
        this.cerrarModal('modificarBannerModal');
        this.abrirModal('editarRedSocialModal');
      },
      error: (err: any) => {
        alert('No se pudieron cargar las redes sociales: ' + (err.error?.message || err.message));
        console.error(err);
      }
    });
  }

  seleccionarRedSocial(red: any) {
    this.redSocialSeleccionada = red;
    this.redSocialEdit = {
      id: red.id,
      nombre: red.nombre,
      url: red.url,
      footerId: red.footer?.id ?? 1
    };
  }

  actualizarRedSocial() {
    if (!this.redSocialEdit.id) {
      alert('Selecciona una red social para editar');
      return;
    }

    const redDTO = {
      nombre: this.redSocialEdit.nombre,
      url: this.redSocialEdit.url,
      footerId: this.redSocialEdit.footerId
    };

    this.footerServicio.actualizarRedSocial(this.redSocialEdit.id, redDTO).subscribe({
      next: (red: any) => {
        alert('Red social actualizada exitosamente');
        this.cerrarModal('editarRedSocialModal');
        this.cargarRedesSociales();
        const index = this.todasLasRedesSociales.findIndex(r => r.id === this.redSocialEdit.id);
        if (index !== -1) {
          this.todasLasRedesSociales[index] = { ...this.todasLasRedesSociales[index], ...redDTO };
        }
        this.redSocialSeleccionada = null;
      },
      error: (err: any) => {
        alert('Error al actualizar la red social: ' + (err.error?.message || err.message));
        console.error(err);
      }
    });
  }

  // ===== MÉTODOS AUXILIARES =====
  private abrirModal(modalId: string) {
    const modal = document.getElementById(modalId);
    if (modal) {
      const modalInstance = bootstrap.Modal.getOrCreateInstance(modal);
      modalInstance.show();
    }
  }

  private cerrarModal(modalId: string) {
    const modal = document.getElementById(modalId);
    if (modal) {
      const modalInstance = bootstrap.Modal.getOrCreateInstance(modal);
      modalInstance.hide();
    }
  }
}
