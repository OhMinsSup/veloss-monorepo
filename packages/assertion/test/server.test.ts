// @vitest-environment node

import { expect, test } from "vitest";
import { isBrowser } from "../src";

test("environment is server", () => {
  expect(isBrowser()).toBe(false);
});
