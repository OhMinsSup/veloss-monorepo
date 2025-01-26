import path from "node:path";
import type { Plugin } from "vite";
import { parse as esModuleLexer, init as initEsModuleLexer } from "es-module-lexer";
import { normalizePath } from "vite";

import { get_env, get_env_dir, get_env_prefix } from "./env";
import { create_static_module } from "./generate";
import { template, template_process_env } from "./template";
import { write_if_changed } from "./utils";
import { env_static_private, env_static_public } from "./vmod";
import type { Env, EnvOptions, Prefix, RuntimeEnv } from "./types";
import { GLOBAL_DEFINEITON_FILE_NAME, VITE_DEFINEITON_FILE_NAME } from "./constants";

export interface ViteT3EnvOptions<
  ClientEnv extends RuntimeEnv = RuntimeEnv,
  ServerEnv extends RuntimeEnv = RuntimeEnv,
> {
  clientEnv: (runtimeEnv: RuntimeEnv, clientPrefix?: string | undefined) => Readonly<ClientEnv>;
  serverEnv?: (runtimeEnv: RuntimeEnv) => Readonly<ServerEnv>;
  envOptions?: EnvOptions;
  prefix?: Partial<Prefix> | string;
}

export const vitePlugin = <ClientEnv extends RuntimeEnv = RuntimeEnv, ServerEnv extends RuntimeEnv = RuntimeEnv>({
  envOptions,
  serverEnv,
  clientEnv,
  prefix: userEnvPrefix,
}: ViteT3EnvOptions<ClientEnv, ServerEnv>): Plugin[] => {
  const defaultPrefix = "VITE_";

  const env: Env<ClientEnv, ServerEnv> = {
    private: {} as ServerEnv,
    public: {} as ClientEnv,
  };

  return [
    {
      name: "vite-plugin-t3-env",
      config: async (config, config_env) => {
        const envDir = await get_env_dir({
          resolvedRoot: normalizePath(config.root ? path.resolve(config.root) : process.cwd()),
          viteConfigEnvDir: config.envDir,
          userConfigEnvFile: envOptions?.envFile,
        });

        const prefix = get_env_prefix({
          userEnvPrefix,
          defaultPrefix,
        });

        const record = get_env(
          {
            envDir,
            prefix,
          },
          config_env.mode,
        );

        const $client: ClientEnv = clientEnv(record.public, prefix.client);

        const $server: ServerEnv = serverEnv ? serverEnv(record.private) : ({} as ServerEnv);

        Object.assign(env, {
          private: $server,
          public: $client,
        });

        const define: Record<string, any> = {};

        for (const key of Object.keys($client)) {
          define[`import.meta.env.${key}`] = JSON.stringify($client[key]);
        }

        for (const key of Object.keys($server)) {
          define[`process.env.${key}`] = JSON.stringify($server[key]);
        }

        return {
          define,
          optimizeDeps: {
            exclude: ["$env"],
          },
        };
      },
      /**
       * Stores the final config.
       */
      async configResolved(config) {
        await initEsModuleLexer;

        write_if_changed(path.resolve(config.root, VITE_DEFINEITON_FILE_NAME), template(env));
        write_if_changed(path.resolve(config.root, GLOBAL_DEFINEITON_FILE_NAME), template_process_env(env.private));
      },
      enforce: "pre",
    },
    {
      name: "t3-env-virtual-modules",
      resolveId(id) {
        // treat $env/static/[public|private] as virtual
        if (id.startsWith("$env/")) {
          return `\0virtual:${id}`;
        }
      },
      load(id) {
        switch (id) {
          case env_static_private: {
            return create_static_module("$env/static/private", env.private);
          }
          case env_static_public: {
            return create_static_module("$env/static/public", env.public);
          }
        }
      },
    },
    {
      name: "t3-env-private-module-server-only",
      transform(code, id, options) {
        if (options?.ssr) {
          return;
        }
        switch (id) {
          case env_static_private: {
            const exports = esModuleLexer(code)[1];
            return {
              code: exports
                .map(({ n: name }) =>
                  name === "default" ? "export default undefined;" : `export const ${name} = undefined;`,
                )
                .join("\n"),
              map: null,
            };
          }
        }
      },
    },
    {
      name: "t3-env-public-module-client-only",
      transform(code, id, options) {
        if (!options?.ssr) {
          return;
        }
        switch (id) {
          case env_static_public: {
            const exports = esModuleLexer(code)[1];
            return {
              code: exports
                .map(({ n: name }) =>
                  name === "default" ? "export default undefined;" : `export const ${name} = undefined;`,
                )
                .join("\n"),
              map: null,
            };
          }
        }
      },
    },
  ];
};
