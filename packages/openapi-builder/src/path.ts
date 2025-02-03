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
  protected client: ReturnType<typeof createOpenApiFetch<Paths, Media>>;
  protected method: Method;

  constructor(options: OpenApiPathOptions<Paths, Method, Media>) {
    this.client = options.client;
    this.method = options.method;
  }

  /**
   * openapi-fetch path
   *
   * @param path - openapi request url path
   *
   * ```ts
   * const client = new OpenApiClient();
   *
   * client.method("get").path("/users");
   * ```
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
