import type {
  createOpenApiFetch,
  DefaultOpenApiPaths,
  ExpandedFetchOptions,
  FetchClientOptions,
} from "@veloss/openapi-ofetch";
import type { MaybeOptionalInit } from "openapi-fetch";
import type { HttpMethod, MediaType, PathsWithMethod } from "openapi-typescript-helpers";

export interface OpenApiPathOptions<
  Paths extends DefaultOpenApiPaths,
  Method extends HttpMethod,
  Media extends MediaType = MediaType,
> {
  client: ReturnType<typeof createOpenApiFetch<Paths, Media>>;
  method: Method;
}

export interface OpenApiOptionOptions<
  Paths extends DefaultOpenApiPaths,
  Method extends HttpMethod,
  Path extends PathsWithMethod<Paths, Method>,
  Media extends MediaType = MediaType,
> {
  client: ReturnType<typeof createOpenApiFetch<Paths, Media>>;
  method: Method;
  path: Path;
}

export interface OpenApiBuilderOptions<
  Paths extends DefaultOpenApiPaths,
  Method extends HttpMethod,
  Path extends PathsWithMethod<Paths, Method>,
  Init extends MaybeOptionalInit<Paths[Path], Method>,
  Media extends MediaType = MediaType,
> {
  client: ReturnType<typeof createOpenApiFetch<Paths, Media>>;
  method: Method;
  path: Path;
  options?: FetchClientOptions<Paths, Method, Path, Init, Media>;
}

export interface SetRetryOptions extends Pick<ExpandedFetchOptions, "retry" | "retryDelay" | "retryStatusCodes"> {}
