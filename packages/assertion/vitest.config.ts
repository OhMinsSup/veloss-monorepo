import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    includeSource: ["src/**/*.test.ts"],
    workspace: [
      {
        extends: true,
        test: {
          environment: "jsdom",
        },
      },
    ],
  },
});
