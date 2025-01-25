// @vitest-environment node

import { expect, test } from "vitest";
import { isBrowser } from "./index";

test("environment is server", () => {
  expect(isBrowser()).toBe(false);
});
