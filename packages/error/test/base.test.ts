import { describe, expect, it } from "vitest";
import { BaseError, createBaseError, isBaseError } from "../src/base";

describe("BaseError", () => {
  it("BaseError", () => {
    const error = new BaseError("error message");
    expect(error.message).toBe("error message");
    expect(error.name).toBe("BaseError");
    expect(error.stack).toBeDefined();
  });

  it("BaseError with data", () => {
    const error = new BaseError("error message", { data: { foo: "bar" } });
    expect(error.message).toBe("error message");
    expect(error.data).toEqual({ foo: "bar" });
    expect(error.name).toBe("BaseError");
    expect(error.stack).toBeDefined();
  });

  it("BaseError with cause", () => {
    const cause = new Error("cause");
    const error = new BaseError("error message", { cause });
    expect(error.message).toBe("error message");
    expect(error.cause).toBe(cause);
    expect(error.name).toBe("BaseError");
    expect(error.stack).toBeDefined();
  });

  it("BaseError with code", () => {
    const error = new BaseError("error message", { code: 404 });
    expect(error.message).toBe("error message");
    expect(error.code).toBe(404);
    expect(error.name).toBe("BaseError");
    expect(error.stack).toBeDefined();
  });

  it("BaseError instanceof Error", () => {
    const error = new BaseError("error message");
    expect(error instanceof Error).toBe(true);
  });

  it("BaseError toJSON", () => {
    const error = new BaseError("error message", { data: { foo: "bar" } });
    expect(error.toJSON()).toEqual({
      message: "error message",
      data: { foo: "bar" },
    });
  });

  it("BaseError isBaseError", () => {
    const error = new BaseError("error message");
    expect(isBaseError(error)).toBe(true);
  });

  it("createBaseError", () => {
    const error = createBaseError("error message");
    expect(error.message).toBe("error message");
    expect(error.name).toBe("BaseError");
    expect(error.stack).toBeDefined();
  });

  it("createBaseError with data", () => {
    const error = createBaseError({
      message: "error message",
      data: { foo: "bar" },
    });
    expect(error.message).toBe("error message");
    expect(error.data).toEqual({ foo: "bar" });
    expect(error.name).toBe("BaseError");
    expect(error.stack).toBeDefined();
  });

  it("createBaseError with cause", () => {
    const cause = new Error("cause");
    const error = createBaseError({
      message: "error message",
      cause,
    });
    expect(error.message).toBe("error message");
    expect(error.cause).toBe(cause);
    expect(error.name).toBe("BaseError");
    expect(error.stack).toBeDefined();
  });

  it("createBaseError with code", () => {
    const error = createBaseError({
      message: "error message",
      code: 404,
    });
    expect(error.message).toBe("error message");
    expect(error.code).toBe(404);
    expect(error.name).toBe("BaseError");
    expect(error.stack).toBeDefined();
  });

  it("createBaseError with stack", () => {
    const error = createBaseError({
      message: "error message",
      stack: "stack",
    });
    expect(error.message).toBe("error message");
    expect(error.name).toBe("BaseError");
    expect(error.stack).toBe("stack");
  });

  it("createBaseError toJSON", () => {
    const error = createBaseError({
      message: "error message",
      data: { foo: "bar" },
    });
    expect(error.toJSON()).toEqual({
      message: "error message",
      data: { foo: "bar" },
    });
  });

  it("createBaseError with BaseError", () => {
    const baseError = new BaseError("error message");
    const error = createBaseError(baseError);
    expect(error).toBe(baseError);
  });

  it("createBaseError instanceof BaseError", () => {
    const error = createBaseError("error message");
    expect(error instanceof BaseError).toBe(true);
  });

  it("createBaseError instanceof Error", () => {
    const error = createBaseError("error message");
    expect(error instanceof Error).toBe(true);
  });

  it("createBaseError isBaseError", () => {
    const error = createBaseError("error message");
    expect(isBaseError(error)).toBe(true);
  });
});
