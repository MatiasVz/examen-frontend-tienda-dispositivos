import { Component, Input, OnInit } from '@angular/core';
import { Empresa } from '../../modelos/Empresa';
import { Banner as BannerModel } from '../../modelos/Banner';
import { EmpresaServicio } from '../../servicios/empresa-servicio';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-banner-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './banner-admin.component.html'
})
export class BannerAdminComponent implements OnInit {
  @Input() empresa?: Empresa;
  loading = false;

  constructor(private empresaService: EmpresaServicio) {}

  ngOnInit(): void {
    if (!this.empresa) {
      // Si no se pasa como input, cargar desde el servicio
      this.empresaService.getEmpresa().subscribe(data => {
        this.empresa = data;
        if (!this.empresa.banners) {
          this.empresa.banners = [];
        }
      });
    }
  }

  agregarBanner() {
    if (!this.empresa?.banners) {
      this.empresa!.banners = [];
    }
    const nuevoBanner: BannerModel = {
      secuencial: 0,
      url: '',
      descripcion: '',
      estaBanner: 1,
      empresa: this.empresa!
    };
    this.empresa!.banners.push(nuevoBanner);
  }

  quitarBanner(index: number) {
    this.empresa?.banners?.splice(index, 1);
  }

  guardarCambios() {
    if (!this.empresa) return;
    this.loading = true;
    const empresaLimpia: Empresa = {
      ...this.empresa,
      banners: this.empresa.banners?.map(b => ({ ...b, empresa: undefined as any })) || []
    };
    this.empresaService.updateEmpresa(empresaLimpia.secuencial, empresaLimpia).subscribe({
      next: (resp) => {
        this.loading = false;
        alert('Banners actualizados con éxito');
        localStorage.setItem('empresa', JSON.stringify(resp));
      },
      error: (err) => {
        this.loading = false;
        alert('Error al guardar los banners');
        console.error(err);
      }
    });
  }
}