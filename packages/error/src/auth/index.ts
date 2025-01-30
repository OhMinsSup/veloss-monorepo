import type { AuthErrorCode } from "./code";
import { BaseError, type BaseErrorConstructorOptions } from "../base";
import { omit } from "../core/utils";

export interface IAuthError<DataT = unknown> extends BaseError<DataT> {
  errorCode?: AuthErrorCode;
  statusCode?: number;
  fatal: boolean;
  unhandled: boolean;
  toJSON(): Pick<AuthError<DataT>, "message" | "statusCode" | "errorCode" | "data">;
}

export interface AuthErrorConstructorOptions<DataT = unknown> extends BaseErrorConstructorOptions<DataT> {
  errorCode?: AuthErrorCode;
  statusCode?: number;
}

export class AuthError<DataT = unknown> extends BaseError<DataT> implements IAuthError<DataT> {
  name = "AuthError";
  errorCode?: AuthErrorCode;
  fatal = false;
  unhandled = false;
  statusCode?: number;

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

export function isAuthError<DataT = unknown>(input: any): input is AuthError<DataT> {
  return input?.constructor?.__auth_error__ === true;
}

export type { AuthErrorCode };
