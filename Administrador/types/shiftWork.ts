import { Empleado } from "./employee";
import { Establecimiento } from "./establishment";

export type RolTurnoEstado =
  | "Enviado"
  | "Observado"
  | "Aprobado"
  | "AprobadoParcial"
  | "Eliminado"
  | "Creado";

export type RolTurnoTipo = "Regular" | "Complementario" | "Extraordinario";

export interface RolTurno {
  id?: number;
  establecimientoId: number;
  organigramaId: number;
  jefeId?: number;
  anio?: number;
  mes?: number | string;
  fechaReg: string;
  fechaMod?: string;
  estado?: RolTurnoEstado;
  observacion?: string;
  jefe?: Empleado;
  detalles?: RolTurnoDetalle[];
}

export interface RolTurnoEstab {
  id?: number;
  rolTurnoId: number;
  establecimientoId: number;
  establecimiento?: Establecimiento;
  rolTurnoDetalle?: RolTurnoDetalle[];
}

export interface RolTurnoDetalle {
  id?: number;
  rolTurnoEstabId?: number;
  empleadoId: number;
  turnoId: number;
  dia: number;
  _estabId: number;
  _esRegular?: boolean;
}

export interface ShiftWorkVm {
  tipoRolTurno: "Regular" | "Extraordinario" | "Complementario";
  estado: "Enviado" | "Creado";
  mesSiguiente?: boolean;
  estabDetalles: ShiftWorkEstabVm[];
}
export interface ShiftWorkEstabVm {
  establecimientoId: number;
  detalles: RolTurnoDetalle[];
}
