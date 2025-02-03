import { type FetchResponse, mergeHeaders, type MaybeOptionalInit } from "openapi-fetch";
import type { HttpMethod, MediaType, PathsWithMethod } from "openapi-typescript-helpers";

import { createHttpError, isHttpError } from "@veloss/error";

import type { DefaultOpenApiPaths, FetchOptions } from "./types/global";
import type { FetchClientOptions, FetchClientRequestInit, FetchClientContext } from "./types/fetch";
import { polyfillGlobalThis } from "./polyfills";
import { createOpenApiClient, isPayloadMethod, omit, retryStatusCodes, selectedFetchMehtod, sleep, use } from "./utils";

// 전역 객체에 대한 폴리필을 적용합니다.
polyfillGlobalThis();

/**
 * create OpenApi Fetch Client Function
 * @param global - Global Fetch Options
 *
 * ```ts
 * const fetch = createOpenApiFetch({
 *  base: "https://api.example.com",
 * });
 *
 * const response = await fetch({
 * method: "GET",
 * path: "/v1/users",
 * });
 *
 * if (response.error) {
 * console.error(response.error);
 * } else {
 * console.log(response.data);
 * }
 * ```
 *
 * @returns Fetch Client Function
 */
export function createOpenApiFetch<Paths extends DefaultOpenApiPaths, Media extends MediaType = MediaType>(
  global: FetchOptions<Paths, Media> = {},
) {
  const { AbortController = globalThis.AbortController, ...opts } = global;

  const client = createOpenApiClient<Paths, Media>(opts);

  if (opts.middleware && Object.keys(opts.middleware).length > 0) {
    // 사용자 정의 미들웨가 존재 할 수 있어서 한번 제거합니다.
    client.eject(opts.middleware);

    // 사용자 정의 미들웨어를 추가합니다.
    client.use(opts.middleware);
  }

  async function onError<
    Method extends HttpMethod,
    Path extends PathsWithMethod<Paths, Method>,
    Init extends MaybeOptionalInit<Paths[Path], Method>,
  >(
    context: FetchClientContext<Paths, Method, Path, Init, Media>,
  ): Promise<FetchResponse<Paths[Path][Method], Init, Media> | undefined> {
    const error = context.error;

    // Is Abort
    // If it is an active abort, it will not retry automatically.
    // https://developer.mozilla.org/en-US/docs/Web/API/DOMException#error_names
    const isAbort = (error && error.name === "AbortError" && !error?.data?.options?.timeout) ?? false;

    const errorData = error?.data?.options;
    // Retry
    if (errorData?.retry !== false && !isAbort) {
      let retries: number;
      if (typeof errorData?.retry === "number") {
        retries = errorData?.retry;
      } else {
        retries = isPayloadMethod(error?.data?.request.method.toUpperCase()) ? 0 : 1;
      }

      const responseCode = error?.statusCode ?? 500;

      if (
        retries > 0 &&
        (Array.isArray(errorData?.retryStatusCodes)
          ? errorData?.retryStatusCodes.includes(responseCode)
          : retryStatusCodes.has(responseCode))
      ) {
        let retryDelay = errorData?.retryDelay;
        if (typeof retryDelay === "function") {
          retryDelay = retryDelay(retries);
        } else if (typeof retryDelay === "boolean" && retryDelay === true) {
          // Exponential Backoff
          const timeout = ~~((Math.random() + 0.5) * (1 << retries)) * 1000;

          retryDelay = timeout;
        } else {
          retryDelay = retryDelay ?? 0;
        }

        if (retryDelay > 0) {
          await sleep(retryDelay);
        }

        context.options = {
          ...context.options,
          retry: retries - 1,
        } as FetchClientOptions<Paths, Method, Path, Init, Media>;

        return await $fetchClient(context.request, context.options);
      }
    }

    if (context.options?.shouldThrowOnError) {
      // Only available on V8 based runtimes (https://v8.dev/docs/stack-trace-api)
      if ("captureStackTrace" in Error) {
        // @ts-expect-error "captureStackTrace" An issue where the type of captureStackTrace cannot be properly inferred.
        Error.captureStackTrace(error, $fetchClient);
      }

      throw error;
    }

    return context.response;
  }

  const $fetchClient = async function fetchClient<
    Method extends HttpMethod,
    Path extends PathsWithMethod<Paths, Method>,
    Init extends MaybeOptionalInit<Paths[Path], Method>,
  >(
    request: FetchClientRequestInit<Paths, Method, Path>,
    options?: FetchClientOptions<Paths, Method, Path, Init, Media>,
  ): Promise<FetchResponse<Paths[Path][Method], Init, Media> | undefined> {
    const context: FetchClientContext<Paths, Method, Path, Init, Media> = {
      request,
      options,
      response: undefined,
      error: undefined,
    };

    if (options?.onFetchRequest) {
      await use(context, options.onFetchRequest);
    }

    const _options = {
      ...(options ?? {}),
      shouldThrowOnError: opts.shouldThrowOnError ?? options?.shouldThrowOnError ?? true,
      headers: mergeHeaders(options?.headers, opts?.headers),
      fetch: opts.fetch ?? options?.fetch,
      querySerializer: opts.querySerializer ?? options?.querySerializer,
      bodySerializer: opts.bodySerializer ?? options?.bodySerializer,
    } as unknown as FetchClientOptions<Paths, Method, Path, Init, Media>;

    let abortTimeout: ReturnType<typeof setTimeout> | undefined;
    if (!_options.signal && _options.timeout) {
      const controller = new AbortController();
      abortTimeout = setTimeout(() => {
        const error = createHttpError({
          message: "[TimeoutError]: The operation was aborted due to timeout",
          name: "TimeoutError",
          code: 23, // DOMException.TIMEOUT_ERR
          data: context,
        });
        controller.abort(error);
      }, _options.timeout);
      _options.signal = controller.signal;
    }

    context.options = _options;

    const init = omit(_options, ["base", "retry", "retryDelay", "retryStatusCodes", "timeout", "shouldThrowOnError"]);

    const fetchClient = selectedFetchMehtod<Paths, Method, Media>(client, context.request.method);

    try {
      // @ts-expect-error "init" An issue where the type of init cannot be properly inferred.
      context.response = await fetchClient(context.request.path, init);
      if (context.response.error) {
        throw createHttpError({
          message: "[FetchError]: An error occurred",
          statusCode: context.response.response.status,
          statusMessage: context.response.response.statusText,
          data: context,
        });
      }
    } catch (e) {
      if (isHttpError<FetchClientContext<Paths, Method, Path, Init, Media>>(e)) {
        context.error = e;
      }

      if (options?.onFetchError) {
        await use(context, options.onFetchError);
      }

      return await onError(context);
    } finally {
      if (abortTimeout) {
        clearTimeout(abortTimeout);
      }
    }

    if (options?.onFetchResponse) {
      await use(context, options.onFetchResponse);
    }

    return context.response;
  };

  return $fetchClient;
}
