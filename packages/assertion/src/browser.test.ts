// @vitest-environment jsdom

import { expect, test } from "vitest";
import { isBrowser } from "./index";

test("environment is browser", () => {
  expect(isBrowser()).toBe(true);
});
