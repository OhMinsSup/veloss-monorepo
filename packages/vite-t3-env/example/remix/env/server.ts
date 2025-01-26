import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
import type { RuntimeEnv } from "@veloss/vite-t3-env";

export const serverEnv = (runtimeEnv: RuntimeEnv) => {
  return createEnv({
    server: {
      DATABASE_URL: z.string().url(),
      NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
      SESSION_SECRET: z.string().min(32),
    },
    runtimeEnv,
  });
};

export type ServerEnv = ReturnType<typeof serverEnv>;
