import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    includeSource: ["test/**/*.ts"],
    testTimeout: 15000,
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
