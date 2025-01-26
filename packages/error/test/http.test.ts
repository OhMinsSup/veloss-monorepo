import { expect, test } from "vitest";
import { HttpError, createHttpError, isHttpError } from "../src/http";
import { isBaseError } from "../src/base";

test("HttpError", () => {
  const error = new HttpError("error message");
  expect(error.message).toBe("error message");
  expect(error.name).toBe("HttpError");
  expect(error.stack).toBeDefined();
});

test("HttpError with statusCode", () => {
  const error = new HttpError("error message", {
    data: { foo: "bar" },
    statusCode: 404,
  });
  expect(error.message).toBe("error message");
  expect(error.statusCode).toBe(404);
  expect(error.name).toBe("HttpError");
});

test("HttpError with statusMessage", () => {
  const error = new HttpError("error message", {
    data: { foo: "bar" },
    statusMessage: "Not Found",
  });
  expect(error.message).toBe("error message");
  expect(error.statusMessage).toBe("Not Found");
  expect(error.name).toBe("HttpError");
});

test("HttpError instanceof Error", () => {
  const error = new HttpError("error message");
  expect(error instanceof Error).toBe(true);
});

test("HttpError isHttpError", () => {
  const error = new HttpError("error message");
  expect(isHttpError(error)).toBe(true);
});

test("HttpError isBaseError", () => {
  const error = new HttpError("error message");
  expect(isBaseError(error)).toBe(true);
});

test("createHttpError", () => {
  const error = createHttpError("error message");
  expect(error.message).toBe("error message");
  expect(error.name).toBe("HttpError");
  expect(error.stack).toBeDefined();
});

test("createHttpError with statusCode", () => {
  const error = createHttpError({
    message: "error message",
    statusCode: 404,
  });
  expect(error.message).toBe("error message");
  expect(error.statusCode).toBe(404);
  expect(error.name).toBe("HttpError");
});

test("createHttpError with statusMessage", () => {
  const error = createHttpError({
    message: "error message",
    statusMessage: "Not Found",
  });
  expect(error.message).toBe("error message");
  expect(error.statusMessage).toBe("Not Found");
  expect(error.name).toBe("HttpError");
});

test("createHttpError instanceof Error", () => {
  const error = createHttpError("error message");
  expect(error instanceof Error).toBe(true);
});

test("createHttpError isHttpError", () => {
  const error = createHttpError("error message");
  expect(isHttpError(error)).toBe(true);
});

test("createHttpError isBaseError", () => {
  const error = createHttpError("error message");
  expect(isBaseError(error)).toBe(true);
});
