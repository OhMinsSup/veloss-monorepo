// @vitest-environment jsdom

import { expect, test } from "vitest";
import { isBrowser } from "../src";

test("environment is browser", () => {
  expect(isBrowser()).toBe(true);
});
