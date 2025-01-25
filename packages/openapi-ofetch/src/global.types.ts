import type { Client, Middleware, ClientOptions as OpenApiFetchClientOptions } from "openapi-fetch";
import type { MediaType } from "openapi-typescript-helpers";

export type Fetch<Paths extends DefaultOpenApiPaths, Media extends MediaType = MediaType> = Client<Paths, Media>;

export type DefaultOpenApiPaths = Record<string, any>;

export type ExpandedFetchOptions = {
  retry?: number | false;

  retryDelay?: number | ((retries: number) => number) | true;

  retryStatusCodes?: number[];

  timeout?: number;

  shouldThrowOnError?: boolean;
};

export type OtherFetchOptions = Omit<OpenApiFetchClientOptions, "baseUrl"> & ExpandedFetchOptions;

export interface FetchOptions<Paths extends DefaultOpenApiPaths, Media extends MediaType = MediaType>
  extends OtherFetchOptions {
  base?: Fetch<Paths, Media> | string;
  AbortController?: typeof AbortController;
  middleware?: Middleware;
}
