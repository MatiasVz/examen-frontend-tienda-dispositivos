export interface Footer {
    id?: number;
    descripcion: string;
    telefono: string;
    ano: number;
    empresaId: number;
}

export interface RedSocial {
    id?: number;
    nombre: string;
    url: string;
    footerId?: number;
}
