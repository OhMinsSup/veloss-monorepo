# @veloss/openapi-builder

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle size][bundle-src]][bundle-href]
[![MIT License][license-src]][license-src]

@veloss/openapi-ofetch 기반으로 구축된 Supabase SDK 스타일의 라이브러리입니다

## Usage

Install:

```bash
# npm
npm install @veloss/openapi-builder

# yarn
yarn add @veloss/openapi-builder

# pnpm
pnpm add @veloss/openapi-builder
```

Import:

```ts
// ESM / Typescript
import { createOpenApiBuilder } from "@veloss/openapi-builder";

// CJS
const { createOpenApiBuilder } = require("@veloss/openapi-builder");
```

## Example

**Basic usage:**

```ts
import { createOpenApiBuilder } from "@veloss/openapi-builder";

const $api = createOpenApiBuilder({
  base: "https://api.example.com",
});

const response = await client.method("get").path("/ok").fetch();
```

## Related

- [openapi-ts](https://openapi-ts.dev/openapi-fetch/) openapi-fetch is a type-safe fetch client that pulls in your OpenAPI schema. Weighs 6 kb and has virtually zero runtime. Works with React, Vue, Svelte, or vanilla JS.

- [ofetch](https://github.com/unjs/ofetch) A better fetch API. Works on node, browser, and workers.

- [@veloss/openapi-ofetch](../openapi-ofetch/README.md) openapi-fetch extension library (ofetch style).

## License

[MIT](./LICENSE)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/@veloss/openapi-builder?style=flat-square
[npm-version-href]: https://npmjs.com/package/@veloss/openapi-builder
[npm-downloads-src]: https://img.shields.io/npm/dm/@veloss/openapi-builder?style=flat-square
[npm-downloads-href]: https://npmjs.com/package/@veloss/@veloss/openapi-builder
[bundle-src]: https://flat.badgen.net/bundlephobia/minzip/@veloss/openapi-builder
[bundle-href]: https://bundlephobia.com/package/@veloss/openapi-builder
[license-src]: https://img.shields.io/npm/l/@veloss/openapi-builder?style=flat-square
