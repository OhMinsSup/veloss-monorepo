import { test, expect } from "vitest";
import { pick, omit } from "../src/core/utils";

test("pick", () => {
  const obj = { a: 1, b: 2, c: 3 };
  expect(pick(obj, ["a", "b"])).toEqual({ a: 1, b: 2 });
});

test("omit", () => {
  const obj = { a: 1, b: 2, c: 3 };
  expect(omit(obj, ["a", "b"])).toEqual({ c: 3 });
});
