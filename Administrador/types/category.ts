export interface Categoria {
  id?: number;
  organigramaId: number;
  denominacion: string;
  color: string;
}

export interface Color {
  r: number;
  g: number;
  b: number;
  a: number;
}
