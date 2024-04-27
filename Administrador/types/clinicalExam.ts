export interface ExamenClinico {
  id?: number;
  dniPaciente: string;
  categoriaId: string;
  examenPdf: File[];
}
