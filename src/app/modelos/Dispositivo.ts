export interface DispositivoImagen {
  secuencial?: number;
  url: string;
  estadoImagen?: number;
  dispositivo?: any;
}

export interface Dispositivo {
  secuencial: number;
  nombre: string;
  categoria: string;
  marca: string;
  modelo: string;
  descripcion: string;
  precio: number;
  stock: number;
  estado: number; // 1: activo, 0: inactivo
  imagenes: DispositivoImagen[];
}