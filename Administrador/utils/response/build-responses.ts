/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosInstance } from "axios";
import { Response, NotifyKinds, Ok, Err } from ".";

// eslint-disable-next-line prettier/prettier
export type Request4<T, R, V, W> = [Promise<Response<T>>, Promise<Response<R>>, Promise<Response<V>>, Promise<Response<W>>];
// eslint-disable-next-line prettier/prettier
export type Request3<T, R, V> = [Promise<Response<T>>, Promise<Response<R>>, Promise<Response<V>>];
// eslint-disable-next-line prettier/prettier
export type Request2<T, R>  = [Promise<Response<T>>, Promise<Response<R>>];
// eslint-disable-next-line prettier/prettier
export type Request1<T> = Promise<Response<T>>[];

// eslint-disable-next-line prettier/prettier
export type Return4<T, R, V, W> = Response<[Response<T>, Response<R>, Response<V>, Response<W>]>;
// eslint-disable-next-line prettier/prettier
export type Return3<T, R, V> = Response<[Response<T>, Response<R>, Response<V>]>;
// eslint-disable-next-line prettier/prettier
export type Return2<T, R> = Response<[Response<T>, Response<R>]>;
// eslint-disable-next-line prettier/prettier
export type Return1<T> = Response<T[]>;

export interface Config4<T, R, V, W> extends Config {
  readonly requests: Request4<T, R, V, W>;
  ifOk?: (ok: [T, R, V, W]) => void;
}

export interface Config3<T, R, V> extends Config {
  readonly requests: Request3<T, R, V>;
  ifOk?: (ok: [T, R, V]) => void;
}

export interface Config2<T, R> extends Config {
  readonly requests: Request2<T, R>;
  ifOk?: (ok: [T, R]) => void;
}

export interface Config1<T> extends Config {
  readonly requests: Request1<T>;
  ifOk?: (ok: T[]) => void;
}

// Internal functions, interfaces, type definitions and constants.

type Return<T, R, V, W> =
  | Return4<T, R, V, W>
  | Return3<T, R, V>
  | Return2<T, R>
  | Return1<T>;

interface Config {
  readonly requests: Promise<Response>[];
  notify?: NotifyKinds;
  finally?: () => void;

  ifOk?: (ok: any) => void;
  ifErr?: (err: Err) => void;
}

function isConfig(obj: unknown | undefined): obj is Config {
  return typeof obj === "object" && obj !== null && "requests" in obj;
}

/**
 * Make multiple requests in parallel and return a single Response with inner responses as payload.
 *
 * @param this the axios instance to use internally.
 * @param config the overloaded options to make the requests.
 * @returns the Response with inner responses inside.
 */
export async function buildResponses<T, R = void, V = void, W = void>(
  this: AxiosInstance,
  config: Config | Promise<Response>[],
): Promise<Return<T, R, V, W>> {
  let promises: Promise<Response>[];
  let opts: Config | undefined;

  if (isConfig(config)) {
    promises = config.requests;
    opts = config;
  } else {
    promises = config;
  }

  const responses = await Promise.allSettled(promises);

  const promCount = promises.length;
  const resCount = responses.length;

  let result: Return<T, R, V, W>;

  const oks: [number, Ok][] = [];
  const errs: [number, Err][] = [];

  if (promCount === resCount) {
    for (const [idx, res] of responses.entries()) {
      if (res.status === "fulfilled") {
        res.value.fold({
          ifOk: (ok) => oks.push([idx, ok]),
          ifErr: (err) => errs.push([idx, err]),
        });
      } else if (res.status === "rejected") {
        errs.push([idx, new Err({ error: res.reason })]);
      } else {
        errs.push([idx, new Err({ error: "TODO" })]);
      }
    }

    const okCount = oks.length;
    const errCount = errs.length;

    if (okCount === resCount) {
      const values = oks.map(([, val]) => val.payload);
      result = new Ok({
        payload: values,
        notify: opts?.notify ?? "ifErr",
      });
    }
    // Second error condition
    else if (errCount === resCount) {
      result = new Err({
        error:
          errs.length > 0
            ? errs[0][1].getError()
            : "Todas las petiticiones han fallado",
        notify: opts?.notify ?? "ifErr",
      });
    } else {
      result = new Err({
        error:
          errs.length > 0
            ? errs[0][1].getError()
            : "Al menos una petición ha fallado",
        notify: opts?.notify ?? "ifErr",
      });
    }
  }
  // The number of HTTP responses does not match the number of HTTP requests.
  else {
    result = new Err({
      error: "El número de peticiones no concuerda con el número de respuestas",
      notify: opts?.notify ?? "ifErr",
    });
  }

  const fold = result.fold({
    ifOk: () =>
      opts?.ifOk ? opts.ifOk(oks.map(([, x]) => x.payload)) : undefined,
    ifErr: opts?.ifErr,
  });

  await Promise.resolve(fold);

  opts?.finally?.();

  return result;
}
