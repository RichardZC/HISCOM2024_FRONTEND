import { Pagination } from "~/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class Paginator<T = any> {
  totalItems: number;
  items: T[];

  constructor(obj?: Pagination<T>) {
    this.totalItems = obj?.totalItems ?? 0;
    this.items = obj?.items ?? [];
  }

  public get pageSize(): number {
    return this.items.length;
  }

  public get isEmpty(): boolean {
    return this.items.length === 0;
  }

  public get isNotEmpty(): boolean {
    return this.items.length > 0;
  }
}
