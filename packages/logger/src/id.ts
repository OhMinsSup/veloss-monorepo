import { createId } from "@paralleldrive/cuid2";

/**
 * Create a logger id.
 *
 * @param id - The id to use.
 *
 * ```ts
 * const loggerId = createLoggerId(); // 'ckjv3v4e0000b3z5z5z5z5z5z'
 * ```
 *
 * @returns The logger id.
 */
export const createLoggerId = (id?: string | undefined) => {
  return id ?? createId();
};
