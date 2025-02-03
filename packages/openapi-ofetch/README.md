# @veloss/openapi-ofetch

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle size][bundle-src]][bundle-href]
[![MIT License][license-src]][license-src]

openapi를 **ofetch** 스타일의 fetch 함수로 사용하기 위한 라이브러리입니다.

## Usage

Install:

```bash
# npm
npm install @veloss/openapi-ofetch

# yarn
yarn add @veloss/openapi-ofetch

# pnpm
pnpm add @veloss/openapi-ofetch
```

Import:

```ts
// ESM / Typescript
import { createOpenApiFetch } from "@veloss/openapi-ofetch";

// CJS
const { createOpenApiFetch } = require("@veloss/openapi-ofetch");
```

## JSON Body

The fetch function based on `openapi-fetch` supports type-safe JSON body. If you pass a value different from the body defined in the openapi schema, the TypeScript compiler will throw an error.

```ts
import { createOpenApiFetch } from "@veloss/openapi-ofetch";

const $fetch = createOpenApiFetch({
  base: "https://api.example.com",
});

const response = await $fetch(
  {
    method: "post",
    path: "/post",
  },
  {
    body: {
      name: "John Doe",
      age: 30,
    },
  }
);
```

## Handling Errors

By default, `openapi-ofetch` does not throw errors. However, you can make it throw errors using the `shouldThrowOnError` option. The errors thrown are inherited from the `BaseError` class of the `@veloss/error` library, which enables error handling.

```ts
import { createOpenApiFetch } from "@veloss/openapi-ofetch";

const $fetch = createOpenApiFetch({
  base: "https://api.example.com",
  shouldThrowOnError: true,
});

try {
  const response = await $fetch({
    method: "get",
    path: "/not-found",
  });
} catch (error) {
  console.error(error);
}
```

```ts
import { createOpenApiFetch, isFetchError } from "@veloss/openapi-ofetch";

const $fetch = createOpenApiFetch({
  base: "https://api.example.com",
  shouldThrowOnError: true, // global option
});

try {
  const response = await $fetch({
    method: "get",
    path: "/not-found",
    shouldThrowOnError: true, // local option
  });
} catch (error) {
  if (isFetchError(error)) {
    console.error("Fetch Error:", error);
  } else {
    console.error("Unknown Error:", error);
  }
}
```

If you want to handle errors without throwing them, set the `shouldThrowOnError` option to false or omit it. In this case, the error will be stored in the error property of the response object.

```ts
import { createOpenApiFetch, isFetchError } from "@veloss/openapi-ofetch";

const $fetch = createOpenApiFetch({
  base: "https://api.example.com",
});

const response = await $fetch({
  method: "get",
  path: "/not-found",
  // shouldThrowOnError: false,
});

if (response.error) {
  console.error(response.error);
}

if (isFetchError(response.error)) {
  console.error("Fetch Error:", response.error);
} else {
  console.error("Unknown Error:", response.error);
}
```

## Auto Retry

`openapi-ofetch` Automatically retries the request if an error happens and if the response status code is included in `retryStatusCodes` list:

**Retry status codes:**

- `408` - Request Timeout
- `409` - Conflict
- `425` - Too Early ([Experimental](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Early-Data))
- `429` - Too Many Requests
- `500` - Internal Server Error
- `502` - Bad Gateway
- `503` - Service Unavailable
- `504` - Gateway Timeout

You can specify the amount of retry and delay between them using `retry` and `retryDelay` options and also pass a custom array of codes using `retryStatusCodes` option.

The default for `retry` is `1` retry, except for `POST`, `PUT`, `PATCH`, and `DELETE` methods where `ofetch` does not retry by default to avoid introducing side effects. If you set a custom value for `retry` it will **always retry** for all requests.

The default for `retryDelay` is `0` ms.

```ts
import { createOpenApiFetch, isFetchError } from "@veloss/openapi-ofetch";

const $fetch = createOpenApiFetch({
  base: "https://api.example.com",
});

const response = await $fetch(
  {
    method: "get",
    path: "/not-found",
  },
  {
    retry: 3,
    retryDelay: 500, // ms
  }
);
```

## Timeout

You can specify `timeout` in milliseconds to automatically abort a request after a timeout (default is disabled).

```ts
import { createOpenApiFetch, isFetchError } from "@veloss/openapi-ofetch";

const $fetch = createOpenApiFetch({
  base: "https://api.example.com",
});

const response = await $fetch(
  {
    method: "get",
    path: "/not-found",
  },
  {
    timeout: 3000, // Timeout after 3 seconds
  }
);
```

## Interceptors

Providing async interceptors to hook into lifecycle events of `ofetch` call is possible.

### onFetchRequest (context: FetchClientContext<Paths, Method, Path, Init, Media>): Promise<void>

Called before the request is sent.

```ts
import { createOpenApiFetch } from "@veloss/openapi-ofetch";

const $fetch = createOpenApiFetch({
  base: "https://api.example.com",
});

const response = await $fetch(
  {
    method: "get",
    path: "/not-found",
  },
  {
    onFetchRequest: (request) => {
      console.log("Request:", request);
    },
  }
);
```

### onFetchResponse (context: FetchClientContext<Paths, Method, Path, Init, Media>): Promise<void>

Called after the response is received.

```ts
import { createOpenApiFetch } from "@veloss/openapi-ofetch";

const $fetch = createOpenApiFetch({
  base: "https://api.example.com",
});

const response = await $fetch(
  {
    method: "get",
    path: "/not-found",
  },
  {
    onFetchResponse: (response) => {
      console.log("Response:", response);
    },
  }
);
```

### onFetchError (context: FetchClientContext<Paths, Method, Path, Init, Media>): Promise<void>

Called when an error occurs.

```ts
import { createOpenApiFetch } from "@veloss/openapi-ofetch";

const $fetch = createOpenApiFetch({
  base: "https://api.example.com",
});

const response = await $fetch(
  {
    method: "get",
    path: "/not-found",
  },
  {
    onFetchError: (error) => {
      console.log("Error:", error);
    },
  }
);
```

## Related

- [openapi-ts](https://openapi-ts.dev/openapi-fetch/) openapi-fetch is a type-safe fetch client that pulls in your OpenAPI schema. Weighs 6 kb and has virtually zero runtime. Works with React, Vue, Svelte, or vanilla JS.

- [ofetch](https://github.com/unjs/ofetch) A better fetch API. Works on node, browser, and workers.

## License

[MIT](./LICENSE)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/@veloss/openapi-ofetch?style=flat-square
[npm-version-href]: https://npmjs.com/package/@veloss/openapi-ofetch
[npm-downloads-src]: https://img.shields.io/npm/dm/@veloss/openapi-ofetch?style=flat-square
[npm-downloads-href]: https://npmjs.com/package/@veloss/openapi-ofetch
[bundle-src]: https://flat.badgen.net/bundlephobia/minzip/@veloss/openapi-ofetch
[bundle-href]: https://bundlephobia.com/package/@veloss/openapi-ofetch
[license-src]: https://img.shields.io/npm/l/@veloss/openapi-ofetch?style=flat-square
