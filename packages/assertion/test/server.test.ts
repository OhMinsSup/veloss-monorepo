// @vitest-environment node

import { expect, test } from "vitest";
import { isBrowser, isNode } from "../src";

test("environment is node", () => {
  expect(isBrowser()).toBe(false);
  expect(isNode()).toBe(true);
});
