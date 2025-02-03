/**
 * Pick the keys from the object
 *
 * @template T - The type of the object
 * @param obj - The object to pick the keys from
 * @param keys - The keys to pick
 * @returns The object with the keys
 *
 * ```ts
 * const obj = { a: 1, b: 2, c: 3 };
 * pick(obj, ["a", "b"]); // { a: 1, b: 2 }
 * ```
 */
export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const newObj: any = {};
  for (const key of keys) {
    newObj[key] = obj[key];
  }
  return newObj;
}

/**
 * Omit the keys from the object
 *
 * @template T - The type of the object
 * @param obj - The object to omit the keys from
 * @param keys - The keys to omit
 * @returns The object without the keys
 *
 * ```ts
 * const obj = { a: 1, b: 2, c: 3 };
 * omit(obj, ["a", "b"]); // { c: 3 }
 * ```
 */
export function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const newObj: any = {};
  for (const key in obj) {
    if (!keys.includes(key as unknown as K)) {
      newObj[key] = obj[key];
    }
  }
  return newObj;
}
