import { describe, expect, it } from "vitest";
import { AuthError, isAuthError, createAuthError } from "../src/auth";
import { isBaseError } from "../src/base";

describe("AuthError", () => {
  it("AuthError", () => {
    const error = new AuthError("error message");
    expect(error.message).toBe("error message");
    expect(error.name).toBe("AuthError");
    expect(error.stack).toBeDefined();
  });

  it("AuthError with errorCode", () => {
    const error = new AuthError("error message", {
      data: { foo: "bar" },
      errorCode: "unknown_error",
    });
    expect(error.message).toBe("error message");
    expect(error.errorCode).toBe("unknown_error");
    expect(error.name).toBe("AuthError");
  });

  it("AuthError with statusCode", () => {
    const error = new AuthError("error message", {
      data: { foo: "bar" },
      statusCode: 404,
    });
    expect(error.message).toBe("error message");
    expect(error.statusCode).toBe(404);
    expect(error.name).toBe("AuthError");
  });

  it("AuthError instanceof Error", () => {
    const error = new AuthError("error message");
    expect(error instanceof Error).toBe(true);
  });

  it("AuthError isAuthError", () => {
    const error = new AuthError("error message");
    expect(isAuthError(error)).toBe(true);
  });

  it("AuthError isBaseError", () => {
    const error = new AuthError("error message");
    expect(isBaseError(error)).toBe(true);
  });

  it("createAuthError", () => {
    const error = createAuthError("error message");
    expect(error.message).toBe("error message");
    expect(error.name).toBe("AuthError");
    expect(error.stack).toBeDefined();
  });

  it("createAuthError with errorCode", () => {
    const error = createAuthError({
      message: "error message",
      errorCode: "unknown_error",
    });
    expect(error.message).toBe("error message");
    expect(error.errorCode).toBe("unknown_error");
    expect(error.name).toBe("AuthError");
  });

  it("createAuthError with statusCode", () => {
    const error = createAuthError({
      message: "error message",
      statusCode: 404,
    });
    expect(error.message).toBe("error message");
    expect(error.statusCode).toBe(404);
    expect(error.name).toBe("AuthError");
  });

  it("createAuthError instanceof Error", () => {
    const error = createAuthError("error message");
    expect(error instanceof Error).toBe(true);
  });

  it("createAuthError isAuthError", () => {
    const error = createAuthError("error message");
    expect(isAuthError(error)).toBe(true);
  });

  it("createAuthError isBaseError", () => {
    const error = createAuthError("error message");
    expect(isBaseError(error)).toBe(true);
  });
});
