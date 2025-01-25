export function isNumber(value: any): value is number {
  return typeof value === "number";
}

export function isNotNumber(value: any) {
  if (!isNumber(value)) {
    return true;
  }

  if (Number.isNaN(value)) {
    return true;
  }

  return !Number.isFinite(value);
}

export function isNumeric(value: any) {
  return value != null && value - Number.parseFloat(value) + 1 >= 0;
}

export function isArray<T>(value: any): value is T[] {
  return Array.isArray(value);
}

export function isEmptyArray(value: any) {
  return isArray(value) && value.length === 0;
}

type AnyFunction = (...args: any[]) => any;

export function isFunction<T extends AnyFunction = AnyFunction>(value: any): value is T {
  return typeof value === "function";
}

export function isDefined(value: any) {
  return typeof value !== "undefined" && value !== undefined;
}

export function isUndefined(value: any): value is undefined {
  return typeof value === "undefined" || value === undefined;
}

export type Dict<T = any> = Record<string, T>;

export function isObject(value: any): value is Dict {
  const type = typeof value;
  return value != null && (type === "object" || type === "function") && !isArray(value);
}

export function isEmptyObject(value: any) {
  return isObject(value) && Object.keys(value).length === 0;
}

export function isNotEmptyObject(value: any): value is object {
  return value && !isEmptyObject(value);
}

export function isNull(value: any): value is null {
  return value === null;
}

export function isString(value: any): value is string {
  return Object.prototype.toString.call(value) === "[object String]";
}

export function isBoolean(value: any): value is boolean {
  return typeof value === "boolean";
}

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

export const isNullOrUndefined = (value: unknown): value is null | undefined => isNull(value) || isUndefined(value);

export function canUseDOM(): boolean {
  return Boolean(typeof window !== "undefined" && window.document && window.document.createElement);
}

export const isBrowser = () => canUseDOM();

export const isTrusted = (value: unknown): value is true => isBoolean(value) && value;

export const isFalsy = (value: unknown): value is false =>
  value === false || value === 0 || value === "" || isNullOrUndefined(value);

export const isPromiseLike = <T = any>(value: unknown): value is PromiseLike<T> =>
  isObject(value) && isFunction((value as PromiseLike<T>).then);
