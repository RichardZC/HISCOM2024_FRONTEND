import { CondicionLaboral } from "./workingCondition";

export interface Empleado {
  id?: string | number;
  tipoEmpleadoId?: string | number;
  tipoDocumentoId: string | number;
  organigramaId?: string | number;
  cargoId?: string | number;
  condicionLaboralId?: string | number;
  profesionId?: string | number;
  colegioProfesionalId?: string | number;
  RegimenLaboralId?: string | number;
  bancoId?: string | number;
  nacionalidadId?: string | number;
  tipoCuentaId?: number;
  estadoCivilId?: number;
  categoriaId?: number;
  apellidoPaterno: string;
  apellidoMaterno: string;
  nombres: string;
  nacimiento: string;
  sexo: string;
  fechaIngreso?: string;
  numeroColegiatura?: string;
  correos?: string;
  numeroDoc: string;
  direccion?: string;
  numeroCuenta?: string;
  cuentaInterbancaria?: string;
  telefonos?: string;
  fechaNombramiento?: string;
  esJefe?: boolean;
  estado: boolean;
  roles: number[];
  correoUsuario: string;
  foto?: string | ArrayBuffer | null;
  nombreCompleto?: string;
  categoria?: string;
}

export interface EmpleadoSW extends Omit<Empleado, "profesiones"> {
  id: number;
  profesion?: { denominacion?: string };
  profesiones: string;
  condicionLaboral: CondicionLaboral;
}
