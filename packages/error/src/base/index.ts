import { omit } from "../core/utils";

export interface BaseErrorConstructorOptions<DataT = unknown> {
  cause?: unknown;
  code?: number;
  data?: DataT;
  fatal?: boolean;
  unhandled?: boolean;
}

interface IBaseError<DataT = unknown> extends Error {
  fatal: boolean;
  unhandled: boolean;
  data?: DataT;
  cause?: unknown;
  code?: number;
  toJSON(): Pick<IBaseError<DataT>, "message" | "data">;
}

export class BaseError<DataT = unknown> extends Error implements IBaseError<DataT> {
  name = "BaseError";
  fatal = false;
  unhandled = false;
  data?: DataT;
  cause?: unknown;
  code?: number;

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

export function isBaseError<DataT = unknown>(input: any): input is BaseError<DataT> {
  return input?.constructor?.__base_error__ === true;
}
