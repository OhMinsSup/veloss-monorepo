import type { AuthErrorCode } from "./code";
import { BaseError } from "../base";
import { omit } from "../utils";

interface IAuthError<DataT = unknown> extends BaseError<DataT> {
  /**
   * The auth error code {@link AuthErrorCode}
   */
  errorCode?: AuthErrorCode;
  /**
   * The http status code {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status}
   */
  statusCode?: number;
  /**
   * @override
   * Convert the error to a JSON object
   * @returns The JSON object representing the error
   */
  toJSON(): Pick<AuthError<DataT>, "message" | "statusCode" | "errorCode" | "data">;
}

interface AuthErrorConstructorOptions<DataT = unknown> extends Omit<Partial<IAuthError<DataT>>, "name" | "toJSON"> {}

/**
 * @class AuthError
 * Auth error class
 * @template DataT - The type of the additional data
 * @extends BaseError<DataT> - The base error class {@link BaseError<DataT>}
 * @implements IAuthError<DataT> - The auth error interface {@link IAuthError<DataT>}
 */
export class AuthError<DataT = unknown> extends BaseError<DataT> implements IAuthError<DataT> {
  name = "AuthError";

  errorCode?: AuthErrorCode;

  statusCode?: number;

  /**
   * Whether the error is an auth error
   */
  static __auth_error__ = true;

  constructor(message: string, opts: AuthErrorConstructorOptions<DataT> = {}) {
    super(message, omit(opts, ["errorCode", "statusCode"]));

    if (opts.errorCode) {
      this.errorCode = opts.errorCode;
    }

    if (opts.statusCode) {
      this.statusCode = opts.statusCode;
    }
  }

  toJSON() {
    const obj: Pick<AuthError<DataT>, "message" | "statusCode" | "errorCode" | "data"> = {
      message: this.message,
    };

    if (this.errorCode !== undefined) {
      obj.errorCode = this.errorCode;
    }

    if (this.statusCode !== undefined) {
      obj.statusCode = this.statusCode;
    }

    if (this.data !== undefined) {
      obj.data = this.data;
    }

    return obj;
  }
}

/**
 * Create an auth error
 * @param input - The input to create the auth error
 * @returns The auth error
 * @template DataT - The type of the data
 *
 * ```ts
 * const error = createAuthError("AuthError");
 * console.log(error instanceof AuthError); // true
 * console.log(error instanceof BaseError); // true
 * console.log(error instanceof Error); // true
 * console.log(error.message); // "AuthError"
 * ```
 */
export function createAuthError<DataT = unknown>(
  input:
    | string
    | (Partial<AuthError<DataT>> & {
        errorCode?: AuthErrorCode | string;
        status?: number;
      }),
) {
  if (typeof input === "string") {
    return new AuthError<DataT>(input);
  }

  if (isAuthError<DataT>(input)) {
    return input;
  }

  const err = new AuthError<DataT>(input.message ?? "AuthError", {
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

  if (input.errorCode) {
    err.errorCode = input.errorCode;
  }

  if (input.statusCode) {
    err.statusCode = input.statusCode;
  } else if (input.status) {
    err.statusCode = input.status;
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
 * Check if the input is an auth error
 * @param input - The input to check
 * @returns True if the input is an auth error, false otherwise
 * @template DataT - The type of the additional data
 *
 * ```ts
 * const error = createAuthError("AuthError");
 * console.log(isAuthError(error)); // true
 * console.log(isAuthError(new Error("AuthError"))); // false
 * ```
 */
export function isAuthError<DataT = unknown>(input: any): input is AuthError<DataT> {
  return input?.constructor?.__auth_error__ === true;
}

export type { AuthErrorCode };
