import { Component, OnInit } from '@angular/core';
import { Empresa } from '../../modelos/Empresa';
import { EmpresaServicio } from '../../servicios/empresa-servicio';
import { Banner } from '../../modelos/Banner';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empresa-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './empresa-component.html',
  styleUrls: ['./empresa-component.css']
})
export class EmpresaComponent implements OnInit {
  empresa: Empresa = {
    secuencial: 0,
    nombre: '',
    logo: '',
    mision: '',
    vision: '',
    anio: '',
    realizadopor: '',
    banners: []
  };

  constructor(private empresaService: EmpresaServicio) {}

  ngOnInit(): void {
    this.empresaService.getEmpresa().subscribe({
      next: (data) => {
        this.empresa = data;
        if (!this.empresa.banners) {
          this.empresa.banners = [];
        }
      },
      error: (err) => console.error(err)
    });
  }

  agregarBanner() {
    if (!this.empresa.banners) {
      this.empresa.banners = [];
    }
    const nuevoBanner: Banner = {
      secuencial: 0,
      url: '',
      descripcion: '',
      estaBanner: 0,
      empresa: this.empresa
    };
    this.empresa.banners.push(nuevoBanner);
  }

  quitarBanner(index: number) {
    if (this.empresa.banners) {
      this.empresa.banners.splice(index, 1);
    }
  }

  guardarCambios(): void {
    const empresaDTO = {
      nombre: this.empresa.nombre,
      logo: this.empresa.logo,
      mision: this.empresa.mision,
      vision: this.empresa.vision,
      anio: this.empresa.anio,
      realizadopor: this.empresa.realizadopor
    };
    this.empresaService.updateEmpresa(this.empresa.secuencial, empresaDTO).subscribe({
      next: (resp) => {
        alert('Datos guardados con éxito');
        localStorage.setItem('empresa', JSON.stringify(resp));
      },
      error: (err) => {
        alert('Error al guardar los datos');
        console.error('Error al guardar:', err);
      }
    });
  }
}
