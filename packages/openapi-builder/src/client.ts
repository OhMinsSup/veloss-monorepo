import type { HttpMethod, MediaType } from "openapi-typescript-helpers";
import { createOpenApiFetch } from "@veloss/openapi-ofetch";
import type { DefaultOpenApiPaths, FetchOptions } from "@veloss/openapi-ofetch";

import { OpenApiPath } from "./path";

export class OpenApiClient<Paths extends DefaultOpenApiPaths, Media extends MediaType = MediaType> {
  /**
   * @memberof OpenApiClient
   * @instance
   * @protected
   * @property {ReturnType<typeof createOpenApiFetch<Paths, Media>>} client
   * @description OpenAPI Fetch Client
   */
  protected client: ReturnType<typeof createOpenApiFetch<Paths, Media>>;

  constructor(options: FetchOptions<Paths, Media> = {}) {
    this.client = createOpenApiFetch<Paths, Media>(options);
  }

  /**
   * @description API 요청을 보낼 method를 지정합니다. method에 따라 요청이 가능한 API Path를 반환합니다.
   * @param {HttpMethod} method
   * @returns {ApiPath<Paths, Method, Media>}
   */
  method<Method extends HttpMethod>(method: Method): OpenApiPath<Paths, Method, Media> {
    return new OpenApiPath<Paths, Method, Media>({
      client: this.client,
      method,
    });
  }
}
