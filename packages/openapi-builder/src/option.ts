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
  /**
   * @memberof OpenApiOption
   * @instance
   * @protected
   * @property {ReturnType<typeof createOpenApiFetch<Paths, Media>>} client
   * @description OpenAPI Fetch Client
   */
  protected client: ReturnType<typeof createOpenApiFetch<Paths, Media>>;

  /**
   * @memberof OpenApiOption
   * @instance
   * @protected
   * @property {Path} path
   * @description API 요청을 보낼 때 사용할 path
   */
  protected path: Path;

  /**
   * @memberof OpenApiOption
   * @instance
   * @protected
   * @property {Method} method
   * @description API 요청을 보낼 때 사용할 method
   */
  protected method: Method;

  /**
   * @memberof OpenApiOption
   * @instance
   * @protected
   * @property {FetchClientOptions<Paths, Method, Path, Init, Media>?} options
   * @description API 요청을 보낼 때 사용할 options
   */
  protected options?: FetchClientOptions<Paths, Method, Path, Init, Media>;

  constructor(options: OpenApiOptionOptions<Paths, Method, Path, Media>) {
    this.client = options.client;
    this.path = options.path;
    this.method = options.method;
  }

  /**
   * @description API 요청을 보낼 때 사용할 options를 설정합니다.
   * @param {FetchClientOptions<Paths, Method, Path, Init, Media>} options
   * @returns {this}
   */
  setOptions(options: FetchClientOptions<Paths, Method, Path, Init, Media>): this {
    this.options = options;
    return this;
  }

  /**
   * @description parseAs를 설정합니다.
   * @param {ParseAs} parseAs
   * @returns {this}
   */
  setParseAs(parseAs: ParseAs): this {
    this.options = {
      ...(this.options ?? {}),
      parseAs,
    } as unknown as FetchClientOptions<Paths, Method, Path, Init, Media>;
    return this;
  }

  /**
   * @description API 요청을 보낼 때 사용할 fetch를 설정합니다.
   * @param {ClientOptions["fetch"]} fetch
   * @returns {this}
   */
  setFetch(fetch: ClientOptions["fetch"]): this {
    this.options = {
      ...(this.options ?? {}),
      fetch,
    } as unknown as FetchClientOptions<Paths, Method, Path, Init, Media>;
    return this;
  }

  /**
   * @description API 요청을 보낼 때 사용할 headers를 설정합니다. 기존 headers가 있을 경우 덮어씁니다.
   * 그리고 이 메소드는 인증토큰을 설정할 때 사용할 수 있습니다.
   * @param {string} token
   * @param {"Bearer" | "Basic"} type
   * @returns {this}
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
   * @description API 요청을 보낼 때 사용할 headers를 설정합니다. 기존 headers가 있을 경우 덮어씁니다.
   * @param {HeadersOptions} headers
   * @returns {this}
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
   * @description API 요청을 보낼 때 사용할 Params를 설정합니다.
   * @param {*} params
   * @returns {this}
   */
  setParams(params: NonNullable<Init>["params"]): this {
    this.options = {
      ...(this.options ?? {}),
      params,
    } as unknown as FetchClientOptions<Paths, Method, Path, Init, Media>;
    return this;
  }

  /**
   * @description API 요청을 보낼 때 사용할 body를 설정합니다.
   * @param {*} body
   * @returns {this}
   */
  setBody(body: NonNullable<Init>["body"]): this {
    this.options = {
      ...(this.options ?? {}),
      body,
    } as unknown as FetchClientOptions<Paths, Method, Path, Init, Media>;
    return this;
  }

  /**
   * @description API 요청을 보낼 때 사용할 BodySerializer를 설정합니다.
   * @param {*} bodySerializer
   * @returns {this}
   */
  setBodySerializer(bodySerializer: NonNullable<Init>["bodySerializer"]): this {
    this.options = {
      ...(this.options ?? {}),
      bodySerializer,
    } as unknown as FetchClientOptions<Paths, Method, Path, Init, Media>;
    return this;
  }

  /**
   * @description API 요청을 보낼 때 사용할 querySerializer를 설정합니다.
   * @param {*} querySerializer
   * @returns {this}
   */
  setQuerySerializer(querySerializer: NonNullable<Init>["querySerializer"]): this {
    this.options = {
      ...(this.options ?? {}),
      querySerializer,
    } as unknown as FetchClientOptions<Paths, Method, Path, Init, Media>;
    return this;
  }

  /**
   * @description API 요청이 실패했을 때 재시도할 횟수를 설정합니다.
   * @param {SetRetryOptions} parmas
   * @returns {this}
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
   * @description API 요청이 실패했을 때 타임아웃을 설정합니다.
   * @param {number} timeout
   * @returns {this}
   */
  setTimeout(timeout: number): this {
    this.options = {
      ...(this.options ?? {}),
      timeout,
    } as unknown as FetchClientOptions<Paths, Method, Path, Init, Media>;
    return this;
  }

  /**
   * @description API 요청이 실패했을 때 에러를 던질지 여부를 설정합니다.
   * @param {boolean} shouldThrowOnError
   * @returns {this}
   */
  setShouldThrowOnError(shouldThrowOnError: boolean): this {
    this.options = {
      ...(this.options ?? {}),
      shouldThrowOnError,
    } as unknown as FetchClientOptions<Paths, Method, Path, Init, Media>;
    return this;
  }

  /**
   * @description API 요청이 실패했을 때 사용할 signal을 설정합니다.
   * @param {AbortSignal} signal
   * @returns {this}
   */
  setSignal(signal: AbortSignal): this {
    this.options = {
      ...(this.options ?? {}),
      signal,
    } as unknown as FetchClientOptions<Paths, Method, Path, Init, Media>;
    return this;
  }

  /**
   * @description API 요청에 대한 미들웨어를 설정합니다.
   * @param {FetchMiddlewareFactory<Paths, Method, Path, Init, Media>} middleware
   * @returns {this}
   */
  setMiddleware(middleware: FetchMiddlewareFactory<Paths, Method, Path, Init, Media>): this {
    this.options = {
      ...(this.options ?? {}),
      ...middleware,
    } as unknown as FetchClientOptions<Paths, Method, Path, Init, Media>;
    return this;
  }

  /**
   * @description 해당 함수를 요청하면 PromiseLike 객체를 반환합니다.
   * @returns {OpenApiBuilder<Paths, Method, Path, Init, Media>}
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
