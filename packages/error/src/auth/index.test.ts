import { expect, test } from "vitest";
import { AuthError, isAuthError, createAuthError } from "./index";
import { isBaseError } from "../base";

test("AuthError", () => {
  const error = new AuthError("error message");
  expect(error.message).toBe("error message");
  expect(error.name).toBe("AuthError");
  expect(error.stack).toBeDefined();
});

test("AuthError with errorCode", () => {
  const error = new AuthError("error message", {
    data: { foo: "bar" },
    errorCode: "unknown_error",
  });
  expect(error.message).toBe("error message");
  expect(error.errorCode).toBe("unknown_error");
  expect(error.name).toBe("AuthError");
});

test("AuthError with statusCode", () => {
  const error = new AuthError("error message", {
    data: { foo: "bar" },
    statusCode: 404,
  });
  expect(error.message).toBe("error message");
  expect(error.statusCode).toBe(404);
  expect(error.name).toBe("AuthError");
});

test("AuthError instanceof Error", () => {
  const error = new AuthError("error message");
  expect(error instanceof Error).toBe(true);
});

test("AuthError isAuthError", () => {
  const error = new AuthError("error message");
  expect(isAuthError(error)).toBe(true);
});

test("AuthError isBaseError", () => {
  const error = new AuthError("error message");
  expect(isBaseError(error)).toBe(true);
});

test("createAuthError", () => {
  const error = createAuthError("error message");
  expect(error.message).toBe("error message");
  expect(error.name).toBe("AuthError");
  expect(error.stack).toBeDefined();
});

test("createAuthError with errorCode", () => {
  const error = createAuthError({
    message: "error message",
    errorCode: "unknown_error",
  });
  expect(error.message).toBe("error message");
  expect(error.errorCode).toBe("unknown_error");
  expect(error.name).toBe("AuthError");
});

test("createAuthError with statusCode", () => {
  const error = createAuthError({
    message: "error message",
    statusCode: 404,
  });
  expect(error.message).toBe("error message");
  expect(error.statusCode).toBe(404);
  expect(error.name).toBe("AuthError");
});

test("createAuthError instanceof Error", () => {
  const error = createAuthError("error message");
  expect(error instanceof Error).toBe(true);
});

test("createAuthError isAuthError", () => {
  const error = createAuthError("error message");
  expect(isAuthError(error)).toBe(true);
});

test("createAuthError isBaseError", () => {
  const error = createAuthError("error message");
  expect(isBaseError(error)).toBe(true);
});
