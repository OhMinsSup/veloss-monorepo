import type { ViteT3EnvOptions } from "./plugin";
import { vitePlugin } from "./plugin";
import type { RuntimeEnv } from "./types";

export type { RuntimeEnv } from "./types";

export const t3EnvPlugin = <ClientEnv extends RuntimeEnv = RuntimeEnv, ServerEnv extends RuntimeEnv = RuntimeEnv>(
  config: ViteT3EnvOptions<ClientEnv, ServerEnv>,
) => {
  return vitePlugin(config);
};
