import type { MediaType } from "openapi-typescript-helpers";

import { OpenApiClient } from "./client";
import type { DefaultOpenApiPaths, FetchOptions } from "@veloss/openapi-ofetch";

/**
 * @description API Client 인스턴스를 생성합니다.
 * @param {ApiClientOptions<Paths>} options
 * @returns {ApiClient<Paths>}
 */
const createOpenApiBuilder = <Paths extends DefaultOpenApiPaths, Media extends MediaType = MediaType>(
  options?: FetchOptions<Paths, Media>,
): OpenApiClient<Paths, Media> => {
  return new OpenApiClient<Paths, Media>(options);
};

export { createOpenApiBuilder, OpenApiClient };
