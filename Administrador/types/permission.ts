export interface Permiso {
  id?: string | number;
  menuId: string | number;
  subMenu: string;
  accion: string;
  ruta: string;
  nombre: string;
  descripcion?: string;
  visible: boolean;
}
