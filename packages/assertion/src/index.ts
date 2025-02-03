import type { AnyFunction, Primitive } from "./types";

/**
 * Check if the value is a number
 *
 * @param value - The value to check
 * @returns True if the value is a number, false otherwise
 *
 * ```ts
 * isNumber(1); // true
 * ```
 */
export function isNumber(value: any): value is number {
  return typeof value === "number";
}

/**
 * Check if the value is not a number
 *
 * @param value - The value to check
 * @returns True if the value is not a number, false otherwise
 *
 * ```ts
 * isNotNumber("1"); // true
 * ```
 */
export function isNotNumber(value: any): value is null | undefined | string | boolean | object | any[] {
  if (!isNumber(value)) {
    return true;
  }

  if (Number.isNaN(value)) {
    return true;
  }

  return !Number.isFinite(value);
}

/**
 * Check if the value is an numberic
 *
 * @param value - The value to check
 * @returns True if the value is an numberic, false otherwise
 *
 * ```ts
 * isNumeric(1); // true
 * isNumeric("1"); // true
 * ```
 */
export function isNumeric(value: any): boolean {
  return value != null && value - Number.parseFloat(value) + 1 >= 0;
}

/**
 * Check if the value is an integer
 *
 * @param value - The value to check
 * @returns True if the value is an integer, false otherwise
 *
 * ```ts
 * isInteger(1); // true
 * ```
 * @since 0.0.4
 */
export function isInteger(value: any): value is number {
  return isNumber(value) && Number.isInteger(value);
}

/**
 * Check if the value is a float
 *
 * @param value - The value to check
 * @returns True if the value is a float, false otherwise
 *
 * ```ts
 * isFloat(1.1); // true
 * ```
 * @since 0.0.4
 */
export function isFloat(value: any): value is number {
  return isNumber(value) && !Number.isInteger(value);
}

/**
 * Check if the value is an array
 *
 * @template T - The type of the array
 * @param value - The value to check
 * @returns True if the value is an array, false otherwise
 *
 * ```ts
 * isArray([1, 2, 3]); // true
 * ```
 */
export function isArray<T>(value: any): value is T[] {
  return Array.isArray(value);
}

/**
 * Check if the value is an empty array
 *
 * @param value - The value to check
 * @returns True if the value is an empty array, false otherwise
 *
 * ```ts
 * isEmptyArray([]); // true
 * ```
 */
export function isEmptyArray(value: any): value is [] {
  return isArray(value) && value.length === 0;
}

/**
 * Check if the value is a function
 *
 * @template T - The type of the function {@link AnyFunction}
 * @param value - The value to check
 * @returns True if the value is a function, false otherwise
 *
 * ```ts
 * isFunction(() => {}); // true
 * ```
 */
export function isFunction<T extends AnyFunction = AnyFunction>(value: any): value is T {
  return typeof value === "function";
}

/**
 * Check if the value is defined
 *
 * @template T - The type of the value
 * @param value - The value to check
 * @returns True if the value is defined, false otherwise
 *
 * ```ts
 * isDefined(1); // true
 * ```
 */
export function isDefined<T>(value: any): value is NonNullable<T> {
  return typeof value !== "undefined" && value !== undefined;
}

/**
 * Check if the value is undefined
 *
 * @param value - The value to check
 * @returns True if the value is undefined, false otherwise
 *
 * ```ts
 * isUndefined(undefined); // true
 * ```
 */
export function isUndefined(value: any): value is undefined {
  return typeof value === "undefined" || value === undefined;
}

/**
 * Check if the value is a null
 *
 * @param value - The value to check
 * @returns True if the value is a null, false otherwise
 *
 * ```ts
 * isNull(null); // true
 * ```
 */
export function isNull(value: any): value is null {
  return value === null;
}

/**
 * Check if the value is an object
 *
 * @param value - The value to check
 * @returns True if the value is an object, false otherwise
 *
 * ```ts
 * isObject({}); // true
 * ```
 */
export function isObject<T extends object = object>(value: any): value is T {
  const type = typeof value;
  return value != null && (type === "object" || type === "function") && !isArray(value);
}

/**
 * Check if the value is an empty object
 *
 * @param value - The value to check
 * @returns True if the value is an empty object, false otherwise
 *
 * ```ts
 * isEmptyObject({}); // true
 * ```
 */

// biome-ignore lint/complexity/noBannedTypes: <explanation>
export function isEmptyObject(value: any): value is {} {
  return isObject(value) && Object.keys(value).length === 0;
}

/**
 * Check if the value is not an empty object
 *
 * @param value - The value to check
 * @returns True if the value is not an empty object, false otherwise
 *
 * ```ts
 * isNotEmptyObject({ key: "value" }); // true
 * ```
 */
export function isNotEmptyObject(value: any): value is object {
  return value && !isEmptyObject(value);
}

/**
 * Check if the value is a string
 *
 * @param value - The value to check
 * @returns True if the value is a string, false otherwise
 *
 * ```ts
 * isString("hello"); // true
 * ```
 */
export function isString(value: any): value is string {
  return Object.prototype.toString.call(value) === "[object String]";
}

/**
 * Check if the value is a boolean
 *
 * @param value - The value to check
 * @returns True if the value is a boolean, false otherwise
 *
 * ```ts
 * isBoolean(true); // true
 * ```
 */
export function isBoolean(value: any): value is boolean {
  return typeof value === "boolean";
}

/**
 * Check if the value is a symbol
 *
 * @param value - The value to check
 * @returns True if the value is a symbol, false otherwise
 *
 * ```ts
 * isSymbol(Symbol("hello")); // true
 * ```
 */
export function isSymbol(value: any): value is symbol {
  return typeof value === "symbol";
}

/**
 * Check if the value is a date
 *
 * @param value - The value to check
 * @returns True if the value is a date, false otherwise
 *
 * ```ts
 * isDate(new Date()); // true
 * ```
 */
export function isDate(value: any): value is Date {
  return value instanceof Date;
}

/**
 * Check if the value is a empty
 *
 * @param value - The value to check
 * @returns  True if the value is a empty, false otherwise
 *
 * ```ts
 * isEmpty(""); // true
 * isEmpty([]); // true
 * isEmpty({}); // true
 * isEmpty(null); // true
 * isEmpty(undefined); // true
 * ```
 */
export function isEmpty(value: any): boolean {
  if (isArray(value)) {
    return isEmptyArray(value);
  }

  if (isObject(value)) {
    return isEmptyObject(value);
  }

  if (isNullOrUndefined(value)) {
    return true;
  }

  if (value === "") {
    return true;
  }

  return false;
}

/**
 * Check if the value is null or undefined
 *
 * @param value - The value to check
 * @returns True if the value is not empty, false otherwise
 *
 * ```ts
 * isNullOrUndefined(null); // true
 * isNullOrUndefined(undefined); // true
 * ```
 */
export const isNullOrUndefined = (value: unknown): value is null | undefined => isNull(value) || isUndefined(value);

/**
 * Check if the value is can be used in the browser
 *
 * @returns True if the value can be used in the browser, false otherwise
 *
 * @since 0.0.4
 */
function canUseDOM(): boolean {
  return Boolean(typeof window !== "undefined" && window.document && window.document.createElement);
}

/**
 * Check if the value is a browser
 *
 * @returns True if the value is a browser, false otherwise
 *
 * ```ts
 * isBrowser(); // true
 * ```
 */
export const isBrowser = (): boolean => canUseDOM();

/**
 * Check if the value is a node
 *
 * @returns True if the value is a node, false otherwise
 *
 * ```ts
 * isNode(); // true
 * ```
 *
 * @since 0.0.4
 */
export const isNode = (): boolean => !isBrowser();

/**
 * Check if the value is a Trusted
 *
 * @param value - The value to check
 * @returns True if the value is a Trusted, false otherwise
 *
 * ```ts
 * isTruthy(true); // true
 * ```
 *
 * @since 0.0.4
 */
export const isTruthy = (value: unknown): value is true => isBoolean(value) && value;

/**
 * Check if the value is a falsy
 *
 * @param value - The value to check
 * @returns True if the value is a falsy, false otherwise
 *
 * ```ts
 * isFalsy(false); // true
 * isFalsy(0); // true
 * ```
 */
export const isFalsy = (value: unknown): value is false | null | undefined | 0 | "" =>
  value === false || value === 0 || value === "" || isNullOrUndefined(value);

/**
 * Check if the value is a PromiseLike
 *
 * @template T - The type of the PromiseLike
 * @param value - The value to check
 * @returns True if the value is a PromiseLike, false otherwise
 *
 * ```ts
 * isPromiseLike(Promise.resolve(1)); // true
 * ```
 */
export const isPromiseLike = <T = any>(value: unknown): value is PromiseLike<T> =>
  isObject(value) && isFunction((value as PromiseLike<T>).then);

/**
 * Check if the value is a Primitive
 *
 * @param value - The value to check
 * @returns True if the value is a Primitive, false otherwise {@link Primitive}
 *
 * ```ts
 * isPrimitive(1); // true
 * isPrimitive("hello"); // true
 * isPrimitive(true); // true
 * ```
 *
 * @since 0.0.3
 */
export function isPrimitive(value: any): value is Primitive {
  return isNull(value) || ["string", "number", "boolean", "symbol"].includes(typeof value) || isUndefined(value);
}

export type { AnyFunction, Primitive };
