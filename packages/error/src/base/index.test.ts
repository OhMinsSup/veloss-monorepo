import { expect, test } from "vitest";
import { BaseError, createBaseError, isBaseError } from "./index";

test("BaseError", () => {
  const error = new BaseError("error message");
  expect(error.message).toBe("error message");
  expect(error.name).toBe("BaseError");
  expect(error.stack).toBeDefined();
});

test("BaseError with data", () => {
  const error = new BaseError("error message", { data: { foo: "bar" } });
  expect(error.message).toBe("error message");
  expect(error.data).toEqual({ foo: "bar" });
  expect(error.name).toBe("BaseError");
  expect(error.stack).toBeDefined();
});

test("BaseError with cause", () => {
  const cause = new Error("cause");
  const error = new BaseError("error message", { cause });
  expect(error.message).toBe("error message");
  expect(error.cause).toBe(cause);
  expect(error.name).toBe("BaseError");
  expect(error.stack).toBeDefined();
});

test("BaseError with code", () => {
  const error = new BaseError("error message", { code: 404 });
  expect(error.message).toBe("error message");
  expect(error.code).toBe(404);
  expect(error.name).toBe("BaseError");
  expect(error.stack).toBeDefined();
});

test("BaseError instanceof Error", () => {
  const error = new BaseError("error message");
  expect(error instanceof Error).toBe(true);
});

test("BaseError toJSON", () => {
  const error = new BaseError("error message", { data: { foo: "bar" } });
  expect(error.toJSON()).toEqual({
    message: "error message",
    data: { foo: "bar" },
  });
});

test("BaseError isBaseError", () => {
  const error = new BaseError("error message");
  expect(isBaseError(error)).toBe(true);
});

test("createBaseError", () => {
  const error = createBaseError("error message");
  expect(error.message).toBe("error message");
  expect(error.name).toBe("BaseError");
  expect(error.stack).toBeDefined();
});

test("createBaseError with data", () => {
  const error = createBaseError({
    message: "error message",
    data: { foo: "bar" },
  });
  expect(error.message).toBe("error message");
  expect(error.data).toEqual({ foo: "bar" });
  expect(error.name).toBe("BaseError");
  expect(error.stack).toBeDefined();
});

test("createBaseError with cause", () => {
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

test("createBaseError with code", () => {
  const error = createBaseError({
    message: "error message",
    code: 404,
  });
  expect(error.message).toBe("error message");
  expect(error.code).toBe(404);
  expect(error.name).toBe("BaseError");
  expect(error.stack).toBeDefined();
});

test("createBaseError with stack", () => {
  const error = createBaseError({
    message: "error message",
    stack: "stack",
  });
  expect(error.message).toBe("error message");
  expect(error.name).toBe("BaseError");
  expect(error.stack).toBe("stack");
});

test("createBaseError toJSON", () => {
  const error = createBaseError({
    message: "error message",
    data: { foo: "bar" },
  });
  expect(error.toJSON()).toEqual({
    message: "error message",
    data: { foo: "bar" },
  });
});

test("createBaseError with BaseError", () => {
  const baseError = new BaseError("error message");
  const error = createBaseError(baseError);
  expect(error).toBe(baseError);
});

test("createBaseError instanceof BaseError", () => {
  const error = createBaseError("error message");
  expect(error instanceof BaseError).toBe(true);
});

test("createBaseError instanceof Error", () => {
  const error = createBaseError("error message");
  expect(error instanceof Error).toBe(true);
});

test("createBaseError isBaseError", () => {
  const error = createBaseError("error message");
  expect(isBaseError(error)).toBe(true);
});
