# T3 Env Plugin

This document describes the properties and usage of t3-env-plugin.

## Concept

- `t3-env-plugin` This project was inspired by svelte-kit's approach to handling environment variables.
  It is a Vite plugin that seamlessly integrates environment variables with t3-env and automatically generates types.

- Define a t3 env function to validate client env and server env environment variables, and when this function is passed to t3EnvPlugin, environment variable validation is performed. After passing validation, environment variables are set in process.env and "$env/static/private"(server), import.meta.env and "$env/static/public"(client) modules. Type files are also automatically generated.

## Examples

### Simple example

```ts
// client.ts
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
import type { RuntimeEnv } from "@veloss/vite-t3-env";

export const clientEnv = (
  runtimeEnv: RuntimeEnv,
  clientPrefix: string | undefined
) => {
  return createEnv({
    clientPrefix,
    client: {
      PUBLIC_SERVER_URL: z.string().url(),
    },
    runtimeEnv,
  });
};

export type ClientEnv = ReturnType<typeof clientEnv>;
```

```ts
// server.ts
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
import type { RuntimeEnv } from "@veloss/vite-t3-env";

export const serverEnv = (runtimeEnv: RuntimeEnv) => {
  return createEnv({
    server: {
      DATABASE_URL: z.string().url(),
      NODE_ENV: z
        .enum(["development", "production", "test"])
        .default("development"),
      SESSION_SECRET: z.string().min(32),
    },
    runtimeEnv,
  });
};

export type ServerEnv = ReturnType<typeof serverEnv>;
```

```ts
// vite.config.ts
import { defineConfig } from "vite";
import { t3EnvPlugin } from "@veloss/vite-t3-env";
import { type ServerEnv, serverEnv } from "./env/server";
import { type ClientEnv, clientEnv } from "./env/client";

export default defineConfig({
  plugins: [
    t3EnvPlugin<ClientEnv, ServerEnv>({
      serverEnv,
      clientEnv,
      prefix: "PUBLIC_",
    }),
    // ...
  ],
});
```

```ts
// global.d.ts
// @veloss/vite-t3-env will generate this file
// this file is generated — do not edit it
declare namespace NodeJS {
  interface ProcessEnv {
    [key: string]: string;
    readonly DATABASE_URL: string;
    readonly NODE_ENV: string;
    readonly SESSION_SECRET: string;
  }
}
```

```ts
// vite-env.d.ts
// @veloss/vite-t3-env will generate this file
// this file is generated — do not edit it

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly PUBLIC_SERVER_URL: string;
}

declare module "$env/static/private" {
  export const DATABASE_URL: string;
  export const NODE_ENV: string;
  export const SESSION_SECRET: string;
}

declare module "$env/static/public" {
  export const PUBLIC_SERVER_URL: string;
}
```

## API

```ts
type RuntimeEnv = Record<string, string | boolean | number | undefined>;

type Prefix = {
  server: string;
  client: string;
};

type EnvOptions = {
  envFile?: string;
};

interface ViteT3EnvOptions<
  ClientEnv extends RuntimeEnv = RuntimeEnv,
  ServerEnv extends RuntimeEnv = RuntimeEnv,
> {
  clientEnv: (
    runtimeEnv: RuntimeEnv,
    clientPrefix?: string | undefined
  ) => Readonly<ClientEnv>;
  serverEnv?: (runtimeEnv: RuntimeEnv) => Readonly<ServerEnv>;
  envOptions?: EnvOptions;
  prefix?: Partial<Prefix> | string;
}

const t3EnvPlugin: <
  ClientEnv extends RuntimeEnv = RuntimeEnv,
  ServerEnv extends RuntimeEnv = RuntimeEnv,
>(
  config: ViteT3EnvOptions<ClientEnv, ServerEnv>
) => vite.Plugin<any>[];
```

### clientEnv

_Type_: `(runtimeEnv: RuntimeEnv, clientPrefix?: string | undefined) => Readonly<ClientEnv>`

Client environment function. This is used to create the client environment.

```ts
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
import type { RuntimeEnv } from "@veloss/vite-t3-env";

const clientEnv = (
  runtimeEnv: RuntimeEnv,
  clientPrefix: string | undefined
) => {
  return createEnv({
    clientPrefix,
    client: {
      PUBLIC_SERVER_URL: z.string().url(),
    },
    runtimeEnv,
  });
};

type ClientEnv = ReturnType<typeof clientEnv>;
```

### serverEnv

_Type_: `(runtimeEnv: RuntimeEnv) => Readonly<ServerEnv>` (optional)

Server environment function. This is used to create the server environment.

```ts
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
import type { RuntimeEnv } from "@veloss/vite-t3-env";

const serverEnv = (runtimeEnv: RuntimeEnv) => {
  return createEnv({
    server: {
      DATABASE_URL: z.string().url(),
      NODE_ENV: z
        .enum(["development", "production", "test"])
        .default("development"),
      SESSION_SECRET: z.string().min(32),
    },
    runtimeEnv,
  });
};

type ServerEnv = ReturnType<typeof serverEnv>;
```

### envOptions

_Type_: `EnvOptions` (optional)

Environment options. This is used to configure the environment file.

```ts
export default defineConfig({
  plugins: [
    t3EnvPlugin<ClientEnv, ServerEnv>({
      serverEnv,
      clientEnv,
      envOptions: {
        envFile: ".env",
      },
    }),
    // ...
  ],
});
```

### prefix

_Type_: `Partial<Prefix> | string` (optional)

Prefix for the environment variables. This is used to add a prefix to the environment

```ts
export default defineConfig({
  plugins: [
    t3EnvPlugin<ClientEnv, ServerEnv>({
      serverEnv,
      clientEnv,
      prefix: "PUBLIC_",
    }),
    // ...
  ],
});

// or
export default defineConfig({
  plugins: [
    t3EnvPlugin<ClientEnv, ServerEnv>({
      serverEnv,
      clientEnv,
      prefix: {
        server: "PRIVATE_",
        client: "PUBLIC_",
      },
    }),
    // ...
  ],
});
```

## Related

- [$env-static-private](https://svelte.dev/docs/kit/$env-static-private)
- [$env-static-public](https://svelte.dev/docs/kit/$env-static-public)

## License

[MIT](../LICENSE)
