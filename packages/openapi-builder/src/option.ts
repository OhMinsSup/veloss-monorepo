import type { ClientOptions, HeadersOptions, MaybeOptionalInit, ParseAs } from "openapi-fetch";
import type { HttpMethod, MediaType, PathsWithMethod } from "openapi-typescript-helpers";

import type {
  DefaultOpenApiPaths,
  FetchClientOptions,
  FetchMiddlewareFactory,
  createOpenApiFetch,
} from "@veloss/openapi-ofetch";

import type { OpenApiOptionOptions, SetRetryOptions } from "./types";
import { OpenApiBuilder } from "./builder";

export class OpenApiOption<
  Paths extends DefaultOpenApiPaths,
  Method extends HttpMethod,
  Path extends PathsWithMethod<Paths, Method>,
  Init extends MaybeOptionalInit<Paths[Path], Method>,
  Media extends MediaType = MediaType,
> {
  protected client: ReturnType<typeof createOpenApiFetch<Paths, Media>>;
  protected path: Path;
  protected method: Method;
  protected options?: FetchClientOptions<Paths, Method, Path, Init, Media>;

  constructor(options: OpenApiOptionOptions<Paths, Method, Path, Media>) {
    this.client = options.client;
    this.path = options.path;
    this.method = options.method;
  }

  /**
   * openapi-fetch setting options
   *
   * @param options - openapi-fetch setting options {@link FetchClientOptions}
   *
   * @example
   * ```ts
   * const client = new OpenApiClient();
   *
   * client.method("get").path("/users").setOptions({ ... });
   * ```
   */
  setOptions(options: FetchClientOptions<Paths, Method, Path, Init, Media>): this {
    this.options = options;
    return this;
  }

  /**
   * openapi-fetch setting options is parseAs
   *
   * @param parseAs - parseAs type {@link ParseAs}
   *
   * @example
   * ```ts
   * const client = new OpenApiClient();
   *
   * client.method("get").path("/users").setParseAs("json");
   * ```
   */
  setParseAs(parseAs: ParseAs): this {
    this.options = {
      ...(this.options ?? {}),
      parseAs,
    } as unknown as FetchClientOptions<Paths, Method, Path, Init, Media>;
    return this;
  }

  /**
   * openapi-fetch setting options is fetch
   *
   * @param fetch - fetch API {@link ClientOptions["fetch"]}
   *
   * @example
   * ```ts
   * const client = new OpenApiClient();
   *
   * client.method("get").path("/users").setFetch(fetch);
   * ```
   */
  setFetch(fetch: ClientOptions["fetch"]): this {
    this.options = {
      ...(this.options ?? {}),
      fetch,
    } as unknown as FetchClientOptions<Paths, Method, Path, Init, Media>;
    return this;
  }

  /**
   * openapi-fetch setting options authorization token
   *
   * @param token - authorization token
   * @param type - 'Bearer' or 'Basic'
   *
   * @example
   * ```ts
   * const client = new OpenApiClient();
   *
   * client.method("get").path("/users").setAuthorization("token", "Bearer");
   * ```
   */
  setAuthorization(token: string, type: "Bearer" | "Basic" = "Bearer"): this {
    const newHeaders = new Headers();
    newHeaders.set("Authorization", `${type} ${token}`);

    if (this.options?.headers) {
      if (this.options.headers instanceof Headers) {
        for (const [key, value] of newHeaders.entries()) {
          this.options.headers.set(key, value);
        }
      } else if (typeof this.options.headers === "object") {
        this.options.headers = {
          ...this.options.headers,
          ...Object.fromEntries(newHeaders.entries()),
        };
      }
    } else {
      this.options = {
        ...(this.options ?? {}),
        headers: newHeaders,
      } as unknown as FetchClientOptions<Paths, Method, Path, Init, Media>;
    }

    return this;
  }

  /**
   * openapi-fetch setting options headers
   *
   * @param headers - headers options {@link HeadersOptions}
   *
   * @example
   * ```ts
   * const client = new OpenApiClient();
   *
   * client.method("get").path("/users").setHeaders({ ... });
   * ```
   */
  setHeaders(headers: HeadersOptions): this {
    if (headers instanceof Headers) {
      this.options = {
        ...(this.options ?? {}),
        headers,
      } as unknown as FetchClientOptions<Paths, Method, Path, Init, Media>;
    } else {
      const newHeaders = new Headers();
      for (const [key, value] of Object.entries(headers)) {
        if (typeof value !== "undefined" || value !== null) {
          if (typeof value === "number" || typeof value === "boolean") {
            newHeaders.set(key, value.toString());
          } else if (typeof value === "string") {
            newHeaders.set(key, value);
          } else {
            newHeaders.set(key, JSON.stringify(value));
          }
        }
      }

      this.options = {
        ...(this.options ?? {}),
        headers: newHeaders,
      } as unknown as FetchClientOptions<Paths, Method, Path, Init, Media>;
    }

    return this;
  }

  /**
   * openapi-fetch setting options params
   *
   * @param params - params options
   *
   * @example
   * ```ts
   * const client = new OpenApiClient();
   *
   * client.method("get").path("/users").setParams({ ... });
   * ```
   */
  setParams(params: NonNullable<Init>["params"]): this {
    this.options = {
      ...(this.options ?? {}),
      params,
    } as unknown as FetchClientOptions<Paths, Method, Path, Init, Media>;
    return this;
  }

  /**
   * openapi-fetch setting options body
   *
   * @param body - body options
   *
   * @example
   * ```ts
   * const client = new OpenApiClient();
   *
   * client.method("post").path("/users").setBody({ ... });
   * ```
   */
  setBody(body: NonNullable<Init>["body"]): this {
    this.options = {
      ...(this.options ?? {}),
      body,
    } as unknown as FetchClientOptions<Paths, Method, Path, Init, Media>;
    return this;
  }

  /**
   * openapi-fetch setting options bodySerializer
   *
   * @param bodySerializer - bodySerializer options
   *
   * @example
   * ```ts
   * const client = new OpenApiClient();
   *
   * client.method("post").path("/users").setBodySerializer({ ... });
   * ```
   */
  setBodySerializer(bodySerializer: NonNullable<Init>["bodySerializer"]): this {
    this.options = {
      ...(this.options ?? {}),
      bodySerializer,
    } as unknown as FetchClientOptions<Paths, Method, Path, Init, Media>;
    return this;
  }

  /**
   * openapi-fetch setting options querySerializer
   *
   * @param querySerializer - querySerializer options
   *
   * @example
   * ```ts
   * const client = new OpenApiClient();
   *
   * client.method("get").path("/users").setQuerySerializer({ ... });
   * ```
   */
  setQuerySerializer(querySerializer: NonNullable<Init>["querySerializer"]): this {
    this.options = {
      ...(this.options ?? {}),
      querySerializer,
    } as unknown as FetchClientOptions<Paths, Method, Path, Init, Media>;
    return this;
  }

  /**
   * openapi-fetch setting options retry
   *
   * @param parmas - retry options {@link SetRetryOptions}
   *
   * @example
   * ```ts
   * const client = new OpenApiClient();
   *
   * client.method("get").path("/users").setRetry({ ... });
   * ```
   */
  setRetry(parmas: SetRetryOptions): this {
    this.options = {
      ...(this.options ?? {}),
      retry: parmas.retry,
      retryStatusCodes: parmas.retryStatusCodes,
      retryDelay: parmas.retryDelay,
    } as unknown as FetchClientOptions<Paths, Method, Path, Init, Media>;
    return this;
  }

  /**
   * openapi-fetch setting options timeout
   *
   * @param timeout - timeout number
   *
   * @example
   * ```ts
   * const client = new OpenApiClient();
   *
   * client.method("get").path("/users").setTimeout(1000);
   * ```
   */
  setTimeout(timeout: number): this {
    this.options = {
      ...(this.options ?? {}),
      timeout,
    } as unknown as FetchClientOptions<Paths, Method, Path, Init, Media>;
    return this;
  }

  /**
   * openapi-fetch setting options shouldThrowOnError
   *
   * @param shouldThrowOnError - shouldThrowOnError boolean
   *
   * @example
   * ```ts
   * const client = new OpenApiClient();
   *
   * client.method("get").path("/users").setShouldThrowOnError(true);
   * ```
   */
  setShouldThrowOnError(shouldThrowOnError: boolean): this {
    this.options = {
      ...(this.options ?? {}),
      shouldThrowOnError,
    } as unknown as FetchClientOptions<Paths, Method, Path, Init, Media>;
    return this;
  }

  /**
   * openapi-fetch setting options signal
   *
   * @param signal - signal AbortSignal
   *
   * @example
   * ```ts
   * const client = new OpenApiClient();
   *
   * client.method("get").path("/users").setSignal(signal);
   * ```
   */
  setSignal(signal: AbortSignal): this {
    this.options = {
      ...(this.options ?? {}),
      signal,
    } as unknown as FetchClientOptions<Paths, Method, Path, Init, Media>;
    return this;
  }

  /**
   * openapi-fetch setting options middleware
   *
   * @param middleware - middleware FetchMiddlewareFactory {@link FetchMiddlewareFactory}
   *
   * @example
   * ```ts
   * const client = new OpenApiClient();
   *
   * client.method("get").path("/users").setMiddleware({ ... });
   * ```
   */
  setMiddleware(middleware: FetchMiddlewareFactory<Paths, Method, Path, Init, Media>): this {
    this.options = {
      ...(this.options ?? {}),
      ...middleware,
    } as unknown as FetchClientOptions<Paths, Method, Path, Init, Media>;
    return this;
  }

  /**
   * openapi-fetch request fetch
   *
   * ```ts
   * const client = new OpenApiClient();
   *
   * client.method("get").path("/users").fetch();
   * ```
   */
  fetch(): OpenApiBuilder<Paths, Method, Path, Init, Media> {
    return new OpenApiBuilder<Paths, Method, Path, Init, Media>({
      client: this.client,
      path: this.path,
      method: this.method,
      options: this.options,
    });
  }
}
