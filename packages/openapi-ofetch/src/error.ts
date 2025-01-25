import { BaseError, type BaseErrorConstructorOptions } from "@veloss/error";

interface IFetchError<DataT = unknown> extends BaseError<DataT> {
  toJSON(): Pick<IFetchError<DataT>, "message" | "data">;
  toData(): DataT | undefined;
}

interface FetchErrorConstructorOptions<DataT = unknown> extends BaseErrorConstructorOptions<DataT> {
  statusCode?: number;
  statusMessage?: string;
}

export class FetchError<DataT = unknown> extends BaseError<DataT> implements IFetchError<DataT> {
  name = "FetchError";

  statusCode?: number;
  statusMessage?: string;

  static __fetch_error__ = true;

  constructor(message: string, opts: FetchErrorConstructorOptions<DataT> = {}) {
    super(message, opts);

    if (opts.statusCode !== undefined) {
      this.statusCode = opts.statusCode;
    }

    if (opts.statusMessage !== undefined) {
      this.statusMessage = opts.statusMessage;
    }
  }

  toJSON() {
    const obj: Pick<FetchError<DataT>, "message" | "data" | "statusCode" | "statusMessage"> = {
      message: this.message,
    };

    if (this.statusCode !== undefined) {
      obj.statusCode = this.statusCode;
    }

    if (this.statusMessage !== undefined) {
      obj.statusMessage = this.statusMessage;
    }

    if (this.data !== undefined) {
      obj.data = this.data;
    }

    return obj;
  }

  toData() {
    return this.data;
  }
}

export function createFetchError<DataT = unknown>(input: string | (Partial<FetchError<DataT>> & {})) {
  if (typeof input === "string") {
    return new FetchError<DataT>(input);
  }

  if (isFetchError<DataT>(input)) {
    return input;
  }

  const err = new FetchError<DataT>(input.message ?? "", {
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

  if (input.statusCode !== undefined) {
    err.statusCode = input.statusCode;
  }

  if (input.statusMessage !== undefined) {
    err.statusMessage = input.statusMessage;
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

export function isFetchError<DataT = unknown>(input: any): input is FetchError<DataT> {
  return input?.constructor?.__fetch_error__ === true;
}
