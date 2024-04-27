import axios, { AxiosInstance } from "axios";
import { Paginator } from "./paginator";
import { ConfigLiteral, Response, IOk, IErr } from ".";

export interface Options {
  attempts?: number;
  paginated?: boolean;
}

export interface ConfigObject extends Options {
  request: ConfigLiteral;
}

export interface ConfigExact extends ConfigObject {
  paginated?: false;
}

export interface OptionsExact extends Options {
  paginated?: false;
}

export interface ConfigPaginated extends ConfigObject {
  paginated: true;
}

export interface OptionsPaginated extends Options {
  paginated: true;
}

export interface ConfigBoth extends ConfigObject {
  paginated: boolean;
}

export interface OptionsBoth extends Options {
  paginated: boolean;
}

// Internal functions. interfaces, type definitions and constants.

function isConfigObject(obj: unknown | undefined): obj is ConfigObject {
  return typeof obj === "object" && obj !== null && "request" in obj;
}

/**
 * Make a simple request and return a Response object.
 *
 * @param this the axios instance to use internally.
 * @param config the request payload.
 * @param opts the requests options for internal handling.
 * @returns the parsed Response from the clean request.
 */
export async function getResponse<T>(
  this: AxiosInstance,
  config: ConfigLiteral | ConfigObject,
  opts?: Options,
): Promise<Response<T | Paginator<T>>> {
  let inner: ConfigLiteral;
  let innerOpts: Options | undefined;

  if (isConfigObject(config)) {
    inner = config.request;
    innerOpts = config;
  } else {
    inner = config;
    innerOpts = opts;
  }

  const attempts = innerOpts?.attempts ?? 1;
  const paginated = innerOpts?.paginated ?? false;

  let resOpts: IOk<T> | IErr = {
    error: "Ha ocurrido un error en la petición",
  };

  for (let i = 0; i < attempts; i++) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, request, status } = await this(inner as any);
      const _data = paginated ? new Paginator(data) : data;
      resOpts = {
        payload: _data,
        requestURL: request.requestURL,
        status,
      };
      break;
    } catch (e) {
      if (axios.isAxiosError(e)) {
        resOpts = {
          error: e.response?.data,
          requestURL: e.request?.requestURL,
          status: e.response?.status,
        };
      }
    }
  }

  return Response.factory<T>(resOpts);
}
