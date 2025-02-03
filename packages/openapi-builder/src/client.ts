import type { HttpMethod, MediaType } from "openapi-typescript-helpers";
import { createOpenApiFetch } from "@veloss/openapi-ofetch";
import type { DefaultOpenApiPaths, FetchOptions } from "@veloss/openapi-ofetch";

import { OpenApiPath } from "./path";

export class OpenApiClient<Paths extends DefaultOpenApiPaths, Media extends MediaType = MediaType> {
  protected client: ReturnType<typeof createOpenApiFetch<Paths, Media>>;

  constructor(options: FetchOptions<Paths, Media> = {}) {
    this.client = createOpenApiFetch<Paths, Media>(options);
  }

  /**
   * openapi-fetch http method
   *
   * @param method - http method
   *
   * ```ts
   * const client = new OpenApiClient();
   *
   * client.method("get");
   * ```
   */
  method<Method extends HttpMethod>(method: Method): OpenApiPath<Paths, Method, Media> {
    return new OpenApiPath<Paths, Method, Media>({
      client: this.client,
      method,
    });
  }
}
