export interface Cargo {
  id?: number;
  organigramaId: number;
  clasificacionId: number;
  nroOrden?: number;
  denominacion: string;
  codigo: string;
  total: number;
  situacionCargo?: number;
  cargoConfianza?: number;
  esEncargado: boolean;
}
