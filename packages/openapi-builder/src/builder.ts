import type { FetchResponse, MaybeOptionalInit } from "openapi-fetch";
import type { HttpMethod, MediaType, PathsWithMethod } from "openapi-typescript-helpers";

import type { OpenApiBuilderOptions } from "./types";
import type { createOpenApiFetch, FetchClientOptions, DefaultOpenApiPaths } from "@veloss/openapi-ofetch";

export class OpenApiBuilder<
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

  constructor(options: OpenApiBuilderOptions<Paths, Method, Path, Init, Media>) {
    this.client = options.client;
    this.path = options.path;
    this.method = options.method;
    this.options = options.options;
  }

  // biome-ignore lint/suspicious/noThenProperty: <explanation>
  then<TResult1 = FetchResponse<Paths[Path][Method], Init, Media> | undefined, TResult2 = never>(
    onfulfilled?:
      | ((value: FetchResponse<Paths[Path][Method], Init, Media> | undefined) => TResult1 | PromiseLike<TResult1>)
      | undefined
      | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null,
  ): PromiseLike<TResult1 | TResult2> {
    return this.client<Method, Path, Init>(
      {
        path: this.path,
        method: this.method,
      },
      this.options,
    ).then(onfulfilled, onrejected);
  }
}
