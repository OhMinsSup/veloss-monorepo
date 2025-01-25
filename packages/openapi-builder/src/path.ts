import type { MaybeOptionalInit } from "openapi-fetch";
import type { HttpMethod, MediaType, PathsWithMethod } from "openapi-typescript-helpers";

import type { DefaultOpenApiPaths, createOpenApiFetch } from "@veloss/openapi-ofetch";

import type { OpenApiPathOptions } from "./types";
import { OpenApiOption } from "./option";

export class OpenApiPath<
  Paths extends DefaultOpenApiPaths,
  Method extends HttpMethod,
  Media extends MediaType = MediaType,
> {
  /**
   * @memberof OpenApiPath
   * @instance
   * @protected
   * @property {ReturnType<typeof createOpenApiFetch<Paths, Media>>} client
   * @description OpenAPI Fetch Client
   */
  protected client: ReturnType<typeof createOpenApiFetch<Paths, Media>>;

  /**
   * @memberof OpenApiPath
   * @instance
   * @protected
   * @property {Method} method
   * @description API 요청을 보낼 때 사용할 method
   */
  protected method: Method;

  constructor(options: OpenApiPathOptions<Paths, Method, Media>) {
    this.client = options.client;
    this.method = options.method;
  }

  /**
   * @description API 요청을 보낼 때 사용할 path를 설정합니다.
   * @param {Path} path
   * @returns {ApiConfig<Paths, Method, Path>}
   */
  path<Path extends PathsWithMethod<Paths, Method>, Init extends MaybeOptionalInit<Paths[Path], Method>>(
    path: Path,
  ): OpenApiOption<Paths, Method, Path, Init, Media> {
    return new OpenApiOption<Paths, Method, Path, Init, Media>({
      client: this.client,
      method: this.method,
      path,
    });
  }
}
