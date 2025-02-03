import type { ClientMethod, MaybeOptionalInit } from "openapi-fetch";
import type { HttpMethod, MediaType, PathsWithMethod } from "openapi-typescript-helpers";
import createClient from "openapi-fetch";

import type { FetchOptions, DefaultOpenApiPaths, Fetch } from "./types/global";
import type { FetchClientContext, FetchMiddleware } from "./types/fetch";

/**
 * Retry status codes
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
 */
export const retryStatusCodes = new Set([
  408, // Request Timeout
  409, // Conflict
  425, // Too Early (Experimental)
  429, // Too Many Requests
  500, // Internal Server Error
]);

/**
 * Network error status codes
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
 */
export const networkErrorStatusCodes = new Set([
  502, // Bad Gateway
  503, // Service Unavailable
  504, // Gateway Timeout
]);

/**
 * Payload methods
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
 */
const payloadMethods = new Set(Object.freeze(["PATCH", "POST", "PUT", "DELETE"]));

/**
 * Check if the method is a payload method.
 * @param method - HTTP method
 * @returns `true` if the method is a payload method
 */
export function isPayloadMethod(method = "GET") {
  return payloadMethods.has(method.toUpperCase());
}

/**
 * Create an OpenAPI client.
 * @param options - openapi-fetch options and other options {@link FetchOptions}
 *
 * ```ts
 * const client = createOpenApiClient({ base: "https://api.example.com" });
 *
 * // or
 *
 * const client = createOpenApiClient({ base: createClient({ baseUrl: options.base, ...}) });
 * ```
 *
 * @returns OpenAPI client {@link https://openapi-ts.dev/openapi-fetch/}
 */
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

/**
 * Select the fetch method.
 * @param fetch - OpenAPI fetch client
 * @param mehtod - HTTP method
 *
 * ```ts
 * const fetch = createOpenApiClient({ base: "https://api.example.com" });
 * const method = selectedFetchMehtod(fetch, "GET");
 * method('/path');
 * ```
 *
 * @returns Fetch method {@link ClientMethod}
 */
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

/**
 * Sleep for a while.
 * @param ms - milliseconds
 * @returns Promise
 *
 * ```ts
 * await sleep(1000);
 * ```
 */
export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Pick the keys from the object
 *
 * @template T - The type of the object
 * @param obj - The object to pick the keys from
 * @param keys - The keys to pick
 * @returns The object with the keys
 *
 * ```ts
 * const obj = { a: 1, b: 2, c: 3 };
 * pick(obj, ["a", "b"]); // { a: 1, b: 2 }
 * ```
 */
export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const newObj: any = {};
  for (const key of keys) {
    newObj[key] = obj[key];
  }
  return newObj;
}

/**
 * Omit the keys from the object
 *
 * @template T - The type of the object
 * @param obj - The object to omit the keys from
 * @param keys - The keys to omit
 * @returns The object without the keys
 *
 * ```ts
 * const obj = { a: 1, b: 2, c: 3 };
 * omit(obj, ["a", "b"]); // { c: 3 }
 * ```
 */
export function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const newObj: any = {};
  for (const key in obj) {
    if (!keys.includes(key as unknown as K)) {
      newObj[key] = obj[key];
    }
  }
  return newObj;
}

/**
 * Fetch middleware.
 * @param context - Fetch client context
 * @param middlewares - Fetch middlewares
 * @returns Promise
 */
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
