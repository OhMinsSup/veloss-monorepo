import { omit } from "../utils";

interface IBaseError<DataT = unknown> extends Error {
  /**
   * Whether the error is fatal
   */
  fatal: boolean;
  /**
   * Whether the error is unhandled
   */
  unhandled: boolean;
  /**
   * @template DataT - The type of the additional data
   * Additional data
   */
  data?: DataT;
  /**
   * The cause of the error
   */
  cause?: unknown;
  /**
   * The error code
   * @link https://developer.mozilla.org/en-US/docs/Web/API/DOMException
   */
  code?: number;
  /**
   * Convert the error to a JSON object
   * @returns The JSON object representing the error
   */
  toJSON(): Pick<IBaseError<DataT>, "message" | "data">;
}

interface BaseErrorConstructorOptions<DataT = unknown> extends Omit<Partial<IBaseError<DataT>>, "name" | "toJSON"> {}

/**
 * @class BaseError
 * Base error class
 * @template DataT - The type of the additional data
 * @extends Error - {@link Error}
 * @implements IBaseError<DataT> - The base error interface {@link IBaseError<DataT>}
 */
export class BaseError<DataT = unknown> extends Error implements IBaseError<DataT> {
  name = "BaseError";

  fatal = false;

  unhandled = false;

  data?: DataT;

  cause?: unknown;

  code?: number;

  /**
   * Whether the error is a base error
   */
  static __base_error__ = true;

  constructor(message: string, opts: BaseErrorConstructorOptions<DataT> = {}) {
    super(message, omit(opts, ["data"]));

    if (opts.cause && !this.cause) {
      this.cause = opts.cause;
    }

    if (opts.code) {
      this.code = opts.code;
    }

    if (opts.data) {
      this.data = opts.data;
    }

    if (opts.fatal !== undefined) {
      this.fatal = opts.fatal;
    }

    if (opts.unhandled !== undefined) {
      this.unhandled = opts.unhandled;
    }
  }

  toJSON() {
    const obj: Pick<BaseError<DataT>, "message" | "data"> = {
      message: this.message,
    };

    if (this.data !== undefined) {
      obj.data = this.data;
    }

    return obj;
  }
}

/**
 * Create a base error
 * @param input - The error message or the error object
 * @returns The base error
 * @template DataT - The type of the additional data
 *
 * ```ts
 * const error = createBaseError("An error occurred");
 * console.log(error instanceof BaseError); // true
 * console.log(error instanceof Error); // true
 * console.error(error.message); // An error occurred
 * ```
 */
export function createBaseError<DataT = unknown>(input: string | Partial<BaseError<DataT>>) {
  if (typeof input === "string") {
    return new BaseError<DataT>(input);
  }

  if (isBaseError<DataT>(input)) {
    return input;
  }

  const err = new BaseError<DataT>(input.message ?? "", {
    cause: input.cause || input,
  });

  if ("stack" in input) {
    try {
      Object.defineProperty(err, "stack", {
        get() {
          return input.stack;
        },
      });
    } catch {
      try {
        err.stack = input.stack;
      } catch {
        // Ignore
      }
    }
  }

  if (input.data) {
    err.data = input.data;
  }

  if (input.fatal !== undefined) {
    err.fatal = input.fatal;
  }

  if (input.unhandled !== undefined) {
    err.unhandled = input.unhandled;
  }

  if (input.code !== undefined) {
    err.code = input.code;
  }

  return err;
}

/**
 * Check if the input is a base error
 * @param input - The input to check
 * @returns True if the input is a base error, false otherwise
 * @template DataT - The type of the additional data
 *
 * ```ts
 * isBaseError(new Error()); // false
 * isBaseError(createBaseError("An error occurred")); // true
 * ```
 */
export function isBaseError<DataT = unknown>(input: any): input is BaseError<DataT> {
  return input?.constructor?.__base_error__ === true;
}
