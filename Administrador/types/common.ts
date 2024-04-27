export interface ErrorPayload {
  statusCode: number;
  message: string;
}

export enum AlertType {
  Success = "success",
  Info = "info",
  Warning = "warning",
  Error = "error",
}

export enum Align {
  Top = "top",
  Right = "right",
  Left = "left",
  Bottom = "bottom",
}

export interface AlertMutation {
  message: string;
  type: AlertType;
  icon?: string;
}

export interface SnackbarMutation {
  message: string;
  color?: string;
  timeout?: number;
  align?: Align;
}

export interface Metadata {
  createBy?: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface DrawerItem {
  icon: string;
  title: string;
  to: string;
}

export interface Pagination<T = any> {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  items: T[];
  metadata: Record<string, unknown> | null;
}

export function defaultPagination<T>(): Pagination<T> {
  const result: Pagination<T> = {
    currentPage: 1,
    itemsPerPage: 5,
    totalItems: 0,
    totalPages: 0,
    items: [],
    metadata: {},
  };
  return result;
}
