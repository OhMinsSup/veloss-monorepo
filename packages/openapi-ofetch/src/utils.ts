import type { ClientMethod, MaybeOptionalInit } from "openapi-fetch";
import type { HttpMethod, MediaType, PathsWithMethod } from "openapi-typescript-helpers";
import createClient from "openapi-fetch";

import type { FetchOptions, DefaultOpenApiPaths, Fetch } from "./global.types";
import type { FetchClientContext, FetchMiddleware } from "./fetch.types";
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
export const retryStatusCodes = new Set([
  408, // Request Timeout
  409, // Conflict
  425, // Too Early (Experimental)
  429, // Too Many Requests
  500, // Internal Server Error
]);

export const networkErrorStatusCodes = new Set([
  502, // Bad Gateway
  503, // Service Unavailable
  504, // Gateway Timeout
]);

const payloadMethods = new Set(Object.freeze(["PATCH", "POST", "PUT", "DELETE"]));

export function isPayloadMethod(method = "GET") {
  return payloadMethods.has(method.toUpperCase());
}

export function createOpenApiClient<Paths extends DefaultOpenApiPaths, Media extends MediaType = MediaType>(
  options: Omit<FetchOptions<Paths, Media>, "AbortController"> = {},
) {
  if (typeof options?.base === "undefined") {
    return createClient<Paths, Media>({
      ...omit(options, ["timeout", "retryDelay", "retryStatusCodes", "retry", "shouldThrowOnError"]),
    });
  }

  if (typeof options?.base === "string") {
    return createClient<Paths, Media>({
      baseUrl: options.base,
      ...omit(options, ["timeout", "retryDelay", "retryStatusCodes", "retry", "shouldThrowOnError"]),
    });
  }

  return options.base;
}

export function selectedFetchMehtod<
  Paths extends DefaultOpenApiPaths,
  Method extends HttpMethod,
  Media extends MediaType = MediaType,
>(fetch: Fetch<Paths, Media>, mehtod: Method): ClientMethod<Paths, Method, Media> {
  switch (mehtod.toLowerCase()) {
    case "post": {
      return fetch.POST;
    }
    case "put": {
      return fetch.PUT;
    }
    case "delete": {
      return fetch.DELETE;
    }
    case "patch": {
      return fetch.PATCH;
    }
    case "head": {
      return fetch.HEAD;
    }
    case "options": {
      return fetch.OPTIONS;
    }
    default: {
      return fetch.GET;
    }
  }
}

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const newObj: any = {};
  for (const key of keys) {
    newObj[key] = obj[key];
  }
  return newObj;
}

export function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const newObj: any = {};
  for (const key in obj) {
    if (!keys.includes(key as unknown as K)) {
      newObj[key] = obj[key];
    }
  }
  return newObj;
}

export async function use<
  Paths extends DefaultOpenApiPaths,
  Method extends HttpMethod,
  Path extends PathsWithMethod<Paths, Method>,
  Init extends MaybeOptionalInit<Paths[Path], Method>,
  Media extends MediaType = MediaType,
>(
  context: FetchClientContext<Paths, Method, Path, Init, Media>,
  middlewares:
    | FetchMiddleware<Paths, Method, Path, Init, Media>
    | FetchMiddleware<Paths, Method, Path, Init, Media>[]
    | undefined,
): Promise<void> {
  if (middlewares) {
    if (Array.isArray(middlewares)) {
      for (const middleware of middlewares) {
        await middleware(context);
      }
    } else {
      await middlewares(context);
    }
  }
}
