import { describe, expect, it } from "vitest";
import { HttpError, createHttpError, isHttpError } from "../src/http";
import { isBaseError } from "../src/base";

describe("HttpError", () => {
  it("HttpError", () => {
    const error = new HttpError("error message");
    expect(error.message).toBe("error message");
    expect(error.name).toBe("HttpError");
    expect(error.stack).toBeDefined();
  });

  it("HttpError with statusCode", () => {
    const error = new HttpError("error message", {
      data: { foo: "bar" },
      statusCode: 404,
    });
    expect(error.message).toBe("error message");
    expect(error.statusCode).toBe(404);
    expect(error.name).toBe("HttpError");
  });

  it("HttpError with statusMessage", () => {
    const error = new HttpError("error message", {
      data: { foo: "bar" },
      statusMessage: "Not Found",
    });
    expect(error.message).toBe("error message");
    expect(error.statusMessage).toBe("Not Found");
    expect(error.name).toBe("HttpError");
  });

  it("HttpError instanceof Error", () => {
    const error = new HttpError("error message");
    expect(error instanceof Error).toBe(true);
  });

  it("HttpError isHttpError", () => {
    const error = new HttpError("error message");
    expect(isHttpError(error)).toBe(true);
  });

  it("HttpError isBaseError", () => {
    const error = new HttpError("error message");
    expect(isBaseError(error)).toBe(true);
  });

  it("createHttpError", () => {
    const error = createHttpError("error message");
    expect(error.message).toBe("error message");
    expect(error.name).toBe("HttpError");
    expect(error.stack).toBeDefined();
  });

  it("createHttpError with statusCode", () => {
    const error = createHttpError({
      message: "error message",
      statusCode: 404,
    });
    expect(error.message).toBe("error message");
    expect(error.statusCode).toBe(404);
    expect(error.name).toBe("HttpError");
  });

  it("createHttpError with statusMessage", () => {
    const error = createHttpError({
      message: "error message",
      statusMessage: "Not Found",
    });
    expect(error.message).toBe("error message");
    expect(error.statusMessage).toBe("Not Found");
    expect(error.name).toBe("HttpError");
  });

  it("createHttpError instanceof Error", () => {
    const error = createHttpError("error message");
    expect(error instanceof Error).toBe(true);
  });

  it("createHttpError isHttpError", () => {
    const error = createHttpError("error message");
    expect(isHttpError(error)).toBe(true);
  });

  it("createHttpError isBaseError", () => {
    const error = createHttpError("error message");
    expect(isBaseError(error)).toBe(true);
  });
});
