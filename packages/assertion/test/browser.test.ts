// @vitest-environment jsdom

import { expect, test } from "vitest";
import { isBrowser, isNode } from "../src";

test("environment is browser", () => {
  expect(isBrowser()).toBe(true);
  expect(isNode()).toBe(false);
});
