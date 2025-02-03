import { expect, describe, it } from "vitest";
import { pick, omit } from "../src/utils";

describe("utils", () => {
  it("pick", () => {
    const obj = { a: 1, b: 2, c: 3 };
    expect(pick(obj, ["a", "b"])).toEqual({ a: 1, b: 2 });
  });

  it("omit", () => {
    const obj = { a: 1, b: 2, c: 3 };
    expect(omit(obj, ["a", "b"])).toEqual({ c: 3 });
  });
});
