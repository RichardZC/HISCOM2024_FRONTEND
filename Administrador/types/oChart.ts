export interface OChart {
  id?: string | number;
  nivelId?: number;
  padreId?: number;
  denominacion: string;
  hijos?: OChart[];
}
