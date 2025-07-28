export interface Empleado {
  secuencial: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  cargo: string;
  departamento?: string;
  foto?: string;
  fechaContratacion?: string;
  estaActivo: boolean;
  empresaId: number;
  empresaNombre?: string;
}

export interface EmpleadoCreateDTO {
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  cargo: string;
  departamento?: string;
  foto?: string;
  fechaContratacion?: string;
  estaActivo: boolean;
  empresaId: number;
}