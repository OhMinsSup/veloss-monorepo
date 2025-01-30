import type { HttpMethod, MediaType, PathsWithMethod } from "openapi-typescript-helpers";
import type { FetchOptions, DefaultOpenApiPaths } from "./global.types";
import type { FetchResponse, MaybeOptionalInit } from "openapi-fetch";
import type { FetchError } from "./error";

export type MaybePromise<T> = T | Promise<T>;
export type MaybeArray<T> = T | T[];

export interface FetchClientRequestInit<
  Paths extends DefaultOpenApiPaths,
  Method extends HttpMethod,
  Path extends PathsWithMethod<Paths, Method>,
> {
  path: Path;
  method: Method;
}

export type FetchClientOptions<
  Paths extends DefaultOpenApiPaths,
  Method extends HttpMethod,
  Path extends PathsWithMethod<Paths, Method>,
  Init extends MaybeOptionalInit<Paths[Path], Method>,
  Media extends MediaType = MediaType,
> = Init &
  Pick<
    FetchOptions<Paths, Media>,
    "timeout" | "retry" | "retryDelay" | "retryStatusCodes" | "base" | "shouldThrowOnError"
  > &
  FetchMiddlewareFactory<Paths, Method, Path, Init, Media>;

export type FetchClientContext<
  Paths extends DefaultOpenApiPaths,
  Method extends HttpMethod,
  Path extends PathsWithMethod<Paths, Method>,
  Init extends MaybeOptionalInit<Paths[Path], Method>,
  Media extends MediaType = MediaType,
> = {
  request: FetchClientRequestInit<Paths, Method, Path>;
  options?: FetchClientOptions<Paths, Method, Path, Init, Media>;
  response?: FetchResponse<Paths[Path][Method], Init, Media>;
  error?: FetchError<FetchClientContext<Paths, Method, Path, Init, Media>>;
};

export type FetchMiddleware<
  Paths extends DefaultOpenApiPaths,
  Method extends HttpMethod,
  Path extends PathsWithMethod<Paths, Method>,
  Init extends MaybeOptionalInit<Paths[Path], Method>,
  Media extends MediaType = MediaType,
> = (context: FetchClientContext<Paths, Method, Path, Init, Media>) => MaybePromise<void>;

export type FetchMiddlewareFactory<
  Paths extends DefaultOpenApiPaths,
  Method extends HttpMethod,
  Path extends PathsWithMethod<Paths, Method>,
  Init extends MaybeOptionalInit<Paths[Path], Method>,
  Media extends MediaType = MediaType,
> = {
  onFetchRequest?: MaybeArray<FetchMiddleware<Paths, Method, Path, Init, Media>>;
  onFetchResponse?: MaybeArray<FetchMiddleware<Paths, Method, Path, Init, Media>>;
  onFetchError?: MaybeArray<FetchMiddleware<Paths, Method, Path, Init, Media>>;
};
