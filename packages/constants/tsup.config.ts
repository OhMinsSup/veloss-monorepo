import type { Options } from "tsup";
import { defineConfig } from "tsup";

export default defineConfig((options: Options) => ({
  entry: {
    index: "src/index.ts",
    auth: "src/auth/index.ts",
    http: "src/http/index.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  minify: !options.watch,
  minifyWhitespace: true,
  clean: true,
  ...options,
}));
