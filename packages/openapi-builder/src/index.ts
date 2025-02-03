import type { MediaType } from "openapi-typescript-helpers";

import { OpenApiClient } from "./client";
import type { DefaultOpenApiPaths, FetchOptions } from "@veloss/openapi-ofetch";

/**
 * Create OpenApiClient
 * @param options - openapi-fetch setting options {@link FetchOptions}
 * @returns OpenApiClient
 */
const createOpenApiBuilder = <Paths extends DefaultOpenApiPaths, Media extends MediaType = MediaType>(
  options?: FetchOptions<Paths, Media>,
): OpenApiClient<Paths, Media> => {
  return new OpenApiClient<Paths, Media>(options);
};

export { createOpenApiBuilder, OpenApiClient };
