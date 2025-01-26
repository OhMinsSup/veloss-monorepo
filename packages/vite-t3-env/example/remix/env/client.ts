import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
import type { RuntimeEnv } from "@veloss/vite-t3-env";

export const clientEnv = (runtimeEnv: RuntimeEnv, clientPrefix: string | undefined) => {
  return createEnv({
    clientPrefix,
    client: {
      PUBLIC_SERVER_URL: z.string().url(),
    },
    runtimeEnv,
  });
};

export type ClientEnv = ReturnType<typeof clientEnv>;
