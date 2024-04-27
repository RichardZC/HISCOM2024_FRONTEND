/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line prettier/prettier
import axios, { AxiosInstance } from "axios";
import { Paginator } from "./paginator";

import {
  ConfigLiteral,
  Response,
  FoldOptions,
  IOk,
  IErr,
  Ok,
  Err,
  NotifyKinds,
} from ".";

export interface Options {
  attempts?: number;
  notify?: NotifyKinds;
  paginated?: boolean;
  finally?: () => void;

  // Fold options.
  ifOk?: (ok: any) => void | Promise<void>;
  ifErr?: (err: Err) => void | Promise<void>;
}

export interface ConfigObject extends Options {
  request: ConfigLiteral;
}

export interface ConfigExact<T> extends ConfigObject {
  paginated?: false;
  ifOk?: (ok: Ok<T>) => void | Promise<void>;
}

export interface OptionsExact<T> extends Options {
  paginated?: false;
  ifOk?: (ok: Ok<T>) => void | Promise<void>;
}

export interface ConfigPaginated<T> extends ConfigObject {
  paginated: true;
  ifOk?: (ok: Ok<Paginator<T>>) => void | Promise<void>;
}

export interface OptionsPaginated<T> extends Options {
  paginated: true;
  ifOk?: (ok: Ok<Paginator<T>>) => void | Promise<void>;
}

export interface ConfigBoth<T> extends ConfigObject {
  paginated: boolean;
  ifOk?: (ok: Ok<T | Paginator<T>>) => void | Promise<void>;
}

export interface OptionsBoth<T> extends Options {
  paginated: boolean;
  ifOk?: (ok: Ok<T | Paginator<T>>) => void | Promise<void>;
}

// Internal functions. interfaces, type definitions and constants.

function isConfigObject(obj: unknown | undefined): obj is ConfigObject {
  return typeof obj === "object" && obj !== null && "request" in obj;
}

/**
 * Make a single requests and return a Response object.
 *
 * @param this the axios instance to use internally.
 * @param config the request payload.
 * @param opts the requests options for internal handling.
 * @returns the parsed Response from the clean request.
 */
export async function buildResponse<T>(
  this: AxiosInstance,
  config: ConfigLiteral | ConfigObject,
  opts?: Options,
): Promise<Response<T | Paginator<T>>> {
  let inner: ConfigLiteral;
  let innerOpts: Options | undefined;

  let foldOpts: FoldOptions<T> | undefined;

  if (isConfigObject(config)) {
    inner = config.request;
    innerOpts = config;

    foldOpts = {
      ifOk: config.ifOk,
      ifErr: config.ifErr,
    };
  } else {
    inner = config;
    innerOpts = opts;

    foldOpts = {
      ifOk: opts?.ifOk,
      ifErr: opts?.ifErr,
    };
  }

  const attempts = innerOpts?.attempts ?? 1;
  const paginated = innerOpts?.paginated ?? false;

  let resOpts: IOk<T> | IErr = {
    error: "Ha ocurrido un error en la petición",
    notify: innerOpts?.notify,
  };

  for (let i = 0; i < attempts; i++) {
    try {
      const { data, request, status } = await this(inner as any);
      const _data = paginated ? new Paginator(data) : data;
      resOpts = {
        payload: _data,
        requestURL: request.requestURL,
        status,
        notify: innerOpts?.notify ?? "ifErr",
      };
      break;
    } catch (e) {
      if (axios.isAxiosError(e)) {
        resOpts = {
          error: e.response?.data,
          requestURL: e.request?.requestURL,
          status: e.response?.status,
          notify: innerOpts?.notify ?? "ifErr",
        };
      }
    }
  }

  const response = Response.factory<T>(resOpts);

  const fold = response.fold(foldOpts);
  await Promise.resolve(fold);

  innerOpts?.finally?.();

  return response;
}
