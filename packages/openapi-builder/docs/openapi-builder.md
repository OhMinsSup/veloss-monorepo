# openapi-builder

This document describes the properties and usage of openapi-builder.

## Examples

### Simple example

```ts
import { createOpenApiFetch } from "@veloss/openapi-ofetch";

const client = createOpenApiBuilder({
  base: "https://api.example.com",
});

const response = await client.method("get").path("/ok").fetch();
```

## openapi-ts options

- [openapi-ts](https://openapi-ts.dev/openapi-fetch/api)
- [openapi-ofetch](../../openapi-ofetch/docs/openapi-ofetch.md)

## Related

- [openapi-ofetch](../../openapi-ofetch/docs/openapi-ofetch.md)
- [openapi-ts](https://openapi-ts.dev/openapi-fetch/)
- [ofetch](https://github.com/unjs/ofetch)
- [supabase-js(postgrest-js)](https://github.com/supabase/postgrest-js)

## License

[MIT](../LICENSE)
