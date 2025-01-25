import { expect, test } from "vitest";
import {
  isArray,
  isBoolean,
  isDefined,
  isEmpty,
  isEmptyArray,
  isEmptyObject,
  isFunction,
  isNull,
  isUndefined,
  isObject,
  isFalsy,
  isNotEmptyObject,
  isNotNumber,
  isNullOrUndefined,
  isNumber,
  isNumeric,
  isPromiseLike,
  isString,
  isTrusted,
} from "./index";

test("isArray", () => {
  expect(isArray([])).toBe(true);
  expect(isArray({})).toBe(false);
  expect(isArray("")).toBe(false);
  expect(isArray(1)).toBe(false);
  expect(isArray(null)).toBe(false);
  expect(isArray(undefined)).toBe(false);
  expect(isArray(true)).toBe(false);
  expect(isArray(false)).toBe(false);
});

test("isBoolean", () => {
  expect(isBoolean(true)).toBe(true);
  expect(isBoolean(false)).toBe(true);
  expect(isBoolean({})).toBe(false);
  expect(isBoolean("")).toBe(false);
  expect(isBoolean(1)).toBe(false);
  expect(isBoolean(null)).toBe(false);
  expect(isBoolean(undefined)).toBe(false);
});

test("isDefined", () => {
  expect(isDefined({})).toBe(true);
  expect(isDefined("")).toBe(true);
  expect(isDefined(1)).toBe(true);
  expect(isDefined(null)).toBe(true);
  expect(isDefined(undefined)).toBe(false);
});

test("isEmpty", () => {
  expect(isEmpty([])).toBe(true);
  expect(isEmpty({})).toBe(true);
  expect(isEmpty("")).toBe(true);
  expect(isEmpty(1)).toBe(false);
  expect(isEmpty(null)).toBe(true);
  expect(isEmpty(undefined)).toBe(true);
  expect(isEmpty(true)).toBe(false);
  expect(isEmpty(false)).toBe(false);
});

test("isEmptyArray", () => {
  expect(isEmptyArray([])).toBe(true);
  expect(isEmptyArray([1])).toBe(false);
});

test("isEmptyObject", () => {
  expect(isEmptyObject({})).toBe(true);
  expect(isEmptyObject({ foo: "bar" })).toBe(false);
});

test("isFunction", () => {
  expect(isFunction(() => {})).toBe(true);
  expect(isFunction({})).toBe(false);
  expect(isFunction("")).toBe(false);
  expect(isFunction(1)).toBe(false);
  expect(isFunction(null)).toBe(false);
  expect(isFunction(undefined)).toBe(false);
});

test("isNull", () => {
  expect(isNull(null)).toBe(true);
  expect(isNull({})).toBe(false);
  expect(isNull("")).toBe(false);
  expect(isNull(1)).toBe(false);
  expect(isNull(undefined)).toBe(false);
});

test("isUndefined", () => {
  expect(isUndefined(undefined)).toBe(true);
  expect(isUndefined(null)).toBe(false);
  expect(isUndefined({})).toBe(false);
  expect(isUndefined("")).toBe(false);
  expect(isUndefined(1)).toBe(false);
});

test("isObject", () => {
  expect(isObject({})).toBe(true);
  expect(isObject([])).toBe(false);
  expect(isObject("")).toBe(false);
  expect(isObject(1)).toBe(false);
  expect(isObject(null)).toBe(false);
  expect(isObject(undefined)).toBe(false);
});

test("isFalsy", () => {
  expect(isFalsy(null)).toBe(true);
  expect(isFalsy(undefined)).toBe(true);
  expect(isFalsy("")).toBe(true);
  expect(isFalsy(0)).toBe(true);
  expect(isFalsy(false)).toBe(true);
  expect(isFalsy(true)).toBe(false);
  expect(isFalsy(1)).toBe(false);
  expect(isFalsy("foo")).toBe(false);
});

test("isNotEmptyObject", () => {
  expect(isNotEmptyObject({})).toBe(false);
  expect(isNotEmptyObject({ foo: "bar" })).toBe(true);
});

test("isNotNumber", () => {
  expect(isNotNumber(null)).toBe(true);
  expect(isNotNumber(undefined)).toBe(true);
  expect(isNotNumber("")).toBe(true);
  expect(isNotNumber(false)).toBe(true);
  expect(isNotNumber(true)).toBe(true);
  expect(isNotNumber({})).toBe(true);
  expect(isNotNumber([])).toBe(true);
  expect(isNotNumber("1")).toBe(true);
  expect(isNotNumber("1.1")).toBe(true);
  expect(isNotNumber(1)).toBe(false);
  expect(isNotNumber(1.1)).toBe(false);
});

test("isNullOrUndefined", () => {
  expect(isNullOrUndefined(null)).toBe(true);
  expect(isNullOrUndefined(undefined)).toBe(true);
  expect(isNullOrUndefined("")).toBe(false);
  expect(isNullOrUndefined(0)).toBe(false);
  expect(isNullOrUndefined(false)).toBe(false);
  expect(isNullOrUndefined(true)).toBe(false);
  expect(isNullOrUndefined(1)).toBe(false);
  expect(isNullOrUndefined("foo")).toBe(false);
});

test("isNumber", () => {
  expect(isNumber(1)).toBe(true);
  expect(isNumber(1.1)).toBe(true);
  expect(isNumber("1")).toBe(false);
  expect(isNumber("1.1")).toBe(false);
  expect(isNumber(null)).toBe(false);
  expect(isNumber(undefined)).toBe(false);
  expect(isNumber("")).toBe(false);
  expect(isNumber(false)).toBe(false);
  expect(isNumber(true)).toBe(false);
  expect(isNumber({})).toBe(false);
  expect(isNumber([])).toBe(false);
});

test("isNumeric", () => {
  expect(isNumeric(1)).toBe(true);
  expect(isNumeric(1.1)).toBe(true);
  expect(isNumeric("1")).toBe(true);
  expect(isNumeric("1.1")).toBe(true);
  expect(isNumeric(null)).toBe(false);
  expect(isNumeric(undefined)).toBe(false);
  expect(isNumeric("")).toBe(false);
  expect(isNumeric(false)).toBe(false);
  expect(isNumeric(true)).toBe(false);
  expect(isNumeric({})).toBe(false);
  expect(isNumeric([])).toBe(false);
});

test("isPromiseLike", () => {
  expect(isPromiseLike(Promise.resolve())).toBe(true);
  // biome-ignore lint/suspicious/noThenProperty: <explanation>
  expect(isPromiseLike({ then: () => {} })).toBe(true);
  expect(isPromiseLike({})).toBe(false);
  expect(isPromiseLike([])).toBe(false);
  expect(isPromiseLike(null)).toBe(false);
  expect(isPromiseLike(undefined)).toBe(false);
  expect(isPromiseLike("")).toBe(false);
  expect(isPromiseLike(0)).toBe(false);
  expect(isPromiseLike(false)).toBe(false);
  expect(isPromiseLike(true)).toBe(false);
});

test("isString", () => {
  expect(isString("")).toBe(true);
  expect(isString("foo")).toBe(true);
  expect(isString(0)).toBe(false);
  expect(isString(false)).toBe(false);
  expect(isString(true)).toBe(false);
  expect(isString({})).toBe(false);
  expect(isString([])).toBe(false);
  expect(isString(null)).toBe(false);
  expect(isString(undefined)).toBe(false);
});

test("isTrusted", () => {
  expect(isTrusted(true)).toBe(true);
  expect(isTrusted(false)).toBe(false);
  expect(isTrusted(0)).toBe(false);
  expect(isTrusted("")).toBe(false);
  expect(isTrusted(null)).toBe(false);
  expect(isTrusted(undefined)).toBe(false);
  expect(isTrusted({})).toBe(false);
  expect(isTrusted([])).toBe(false);
});
