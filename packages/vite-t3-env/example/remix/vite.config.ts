import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { t3EnvPlugin } from "@veloss/vite-t3-env";
import { type ServerEnv, serverEnv } from "./env/server";
import { type ClientEnv, clientEnv } from "./env/client";

declare module "@remix-run/node" {
  interface Future {
    v3_singleFetch: true;
  }
}

export default defineConfig({
  plugins: [
    t3EnvPlugin<ClientEnv, ServerEnv>({
      serverEnv,
      clientEnv,
      prefix: "PUBLIC_",
    }),
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_singleFetch: true,
        v3_lazyRouteDiscovery: true,
      },
    }),
    tsconfigPaths(),
  ],
});
