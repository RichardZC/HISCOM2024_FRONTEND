/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { commonStore } from "../store-accessor";
import * as GetResponse from "./get-response";
import * as BuildResponse from "./build-response";
import * as BuildResponses from "./build-responses";
import { Paginator } from "./paginator";
import { AlertType } from "~/types";

export type NotifyKinds = "always" | "ifOk" | "ifErr" | false | undefined;

export interface FoldOptions<T> {
  ifOk?: (ok: Ok<T>) => void;
  ifErr?: (err: Err) => void;
}

export interface MapOptions<T, E> {
  ifOk: (ok: Ok<T>) => E;
  ifErr: (err: Err) => E;
}

interface ErrInfo {
  property: string;
  errors: string[];
}

/**
 * Response base class.
 */
export abstract class Response<T = any> {
  public readonly requestURL?: string;
  public readonly status?: number;

  public constructor(requestURL?: string, status?: number) {
    this.requestURL = requestURL;
    this.status = status;
  }

  public static factory<T>(opt: IOk<T> | IErr): Response<T> {
    if (isIOk(opt)) {
      return new Ok<T>(opt);
    }

    return new Err(opt);
  }

  public abstract notify(opt: NotifyKinds): void;
  public abstract fold(opts: FoldOptions<T>): void;
  public abstract map<E>(opts: MapOptions<T, E>): E;

  public get isOk(): boolean {
    return this instanceof Ok;
  }

  public get isErr(): boolean {
    return this instanceof Err;
  }
}

export interface IOk<T> {
  payload: T;
  requestURL?: string;
  status?: number;
  notify?: NotifyKinds;
}

export function isIOk(obj: unknown): obj is IOk<any> {
  return typeof obj === "object" && obj !== null && "payload" in obj;
}

/**
 * Ok class.
 */
export class Ok<T = any> extends Response<T> {
  public payload: T;

  public constructor(opts: IOk<T>) {
    super(opts.requestURL, opts.status);
    this.payload = opts.payload;

    this.notify(opts.notify);
  }

  public notify(opt: NotifyKinds): void {
    if (opt && (opt === "ifOk" || opt === "always")) {
      commonStore.showAlert({
        type: AlertType.Success,
        // eslint-disable-next-line prettier/prettier
          message:         
          `<div style="margin-bottom:4px;"><b>Éxito</b></div>
          <div>La petición se ha completado correctamente</div>`,
      });
    }
  }

  public fold(opts: FoldOptions<T>): void {
    return opts.ifOk?.(this);
  }

  public map<E>(opts: MapOptions<T, E>): E {
    return opts.ifOk(this);
  }
}

export interface IErr {
  error: unknown;
  requestURL?: string;
  status?: number;
  notify?: NotifyKinds;
}

export function isIErr(obj: unknown): obj is IErr {
  return typeof obj === "object" && obj !== null && "error" in obj;
}

/**
 * Err class.
 */
export class Err extends Response<never> {
  private error?: string;
  private messages?: ErrInfo[];

  public constructor(opts: IErr) {
    super(opts.requestURL, opts.status);

    if (opts.status === 404) {
      this.error = "El recurso solicitado no ha sido encontrado";
    } else if (typeof opts.error === "string") {
      this.error = opts.error;
    } else if (opts.error !== undefined && opts.error !== null) {
      let hasError = false;

      if (typeof opts.error === "object") {
        const err = opts.error as Record<string, unknown>;

        if ("errors" in err) {
          if (Array.isArray(err.errors)) {
            this.error = err.errors.join(", ");
            hasError = true;
          }
        }

        if ("messages" in err) {
          if (Array.isArray(err.messages) && err.messages.length > 0) {
            const messages = err.messages.filter((x) => isErrInfo(x));

            if (messages.length > 0) {
              this.messages = messages;
              hasError = true;
            }
          }
        }
      }

      if (!hasError) {
        this.error = String(opts.error);
      }
    }

    this.notify(opts.notify);
  }

  public notify(opt: NotifyKinds): void {
    if (opt && (opt === "ifErr" || opt === "always")) {
      commonStore.showAlert({
        type: AlertType.Error,
        // eslint-disable-next-line prettier/prettier
          message:
          `<div style="margin-bottom:4px;"><b>Error</b></div>
          <div>${this.getError()}</div>`,
      });
    }
  }

  public fold(opts: FoldOptions<never>): void {
    return opts.ifErr?.(this);
  }

  public map<E>(opts: MapOptions<never, E>): E {
    return opts.ifErr(this);
  }

  public get hasData(): boolean {
    return (
      this.error !== undefined ||
      (this.messages !== undefined && this.messages.length > 0)
    );
  }

  public getError(): string {
    if (this.error) {
      return this.error;
    }

    if (this.messages && this.messages.length > 0) {
      const makeInner = (error: string) =>
        `<li style="margin-left:12px;">${error}</div>`;

      return this.messages
        .map(
          (message) =>
            // eslint-disable-next-line prettier/prettier
          `<div>
            <b>${message.property}:</b>
            ${message.errors.map(makeInner).join("")}
    
            </div>`,
        )
        .join("");
    }

    return "Ha ocurrido un error en la petición";
  }
}

function isErrInfo(obj?: unknown): obj is ErrInfo {
  if (obj && typeof obj === "object" && "property" in obj && "errors" in obj) {
    const e = obj as { property: unknown; errors: unknown };
    return typeof e.property === "string" && Array.isArray(e.errors);
  }

  return false;
}

// ANCHOR EgAxiosInstance.

export type ConfigLiteral = string | AxiosRequestConfig;

export interface EgAxiosInstance extends AxiosInstance {
  // Make SIMPLE requests.
  // eslint-disable-next-line prettier/prettier
  getResponse<T = any>(
    config: GetResponse.ConfigExact
  ): Promise<Response<T>>;

  getResponse<T = any>(
    config: GetResponse.ConfigPaginated,
  ): Promise<Response<Paginator<T>>>;

  getResponse<T = any>(
    config: GetResponse.ConfigBoth,
  ): Promise<Response<T | Paginator<T>>>;

  getResponse<T = any>(
    config: ConfigLiteral,
    options?: GetResponse.OptionsExact,
  ): Promise<Response<T>>;

  getResponse<T = any>(
    config: ConfigLiteral,
    options?: GetResponse.OptionsPaginated,
  ): Promise<Response<Paginator<T>>>;

  getResponse<T = any>(
    config: ConfigLiteral,
    options?: GetResponse.OptionsBoth,
  ): Promise<Response<T | Paginator<T>>>;

  // Make SINGLE requests.
  buildResponse<T = any>(
    config: BuildResponse.ConfigExact<T>,
  ): Promise<Response<T>>;

  buildResponse<T = any>(
    config: BuildResponse.ConfigPaginated<T>,
  ): Promise<Response<Paginator<T>>>;

  buildResponse<T = any>(
    config: BuildResponse.ConfigBoth<T>,
  ): Promise<Response<T | Paginator<T>>>;

  buildResponse<T = any>(
    config: ConfigLiteral,
    options?: BuildResponse.OptionsExact<T>,
  ): Promise<Response<T>>;

  buildResponse<T = any>(
    config: ConfigLiteral,
    options?: BuildResponse.OptionsPaginated<T>,
  ): Promise<Response<Paginator<T>>>;

  buildResponse<T = any>(
    config: ConfigLiteral,
    options?: BuildResponse.OptionsBoth<T>,
  ): Promise<Response<T | Paginator<T>>>;

  // Make MULTIPLE requests.
  buildResponses<T = any, R = any, V = any, W = any>(
    config: BuildResponses.Config4<T, R, V, W>,
  ): Promise<BuildResponses.Return4<T, R, V, W>>;

  buildResponses<T = any, R = any, V = any>(
    config: BuildResponses.Config3<T, R, V>,
  ): Promise<BuildResponses.Return3<T, R, V>>;

  buildResponses<T = any, R = any>(
    config: BuildResponses.Config2<T, R>,
  ): Promise<BuildResponses.Return2<T, R>>;

  buildResponses<T = any>(
    opts: BuildResponses.Config1<T>,
  ): Promise<BuildResponses.Return1<T>>;
}

export const createAxios = (config?: AxiosRequestConfig): EgAxiosInstance => {
  const _axios = axios.create(config) as EgAxiosInstance;
  _axios.getResponse = GetResponse.getResponse;
  _axios.buildResponse = BuildResponse.buildResponse;
  (_axios.buildResponses as any) = BuildResponses.buildResponses;
  return _axios;
};
