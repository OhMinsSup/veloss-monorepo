import { BaseError, type BaseErrorConstructorOptions } from "../base";
import { omit } from "../core/utils";

export interface IHttpError<DataT = unknown> extends BaseError<DataT> {
  statusCode: number;
  statusMessage?: string;
  toJSON(): Pick<IHttpError<DataT>, "message" | "statusCode" | "statusMessage" | "data">;
}

export interface HttpErrorConstructorOptions<DataT = unknown> extends BaseErrorConstructorOptions<DataT> {
  statusCode?: number;
  statusMessage?: string;
}

export class HttpError<DataT = unknown> extends BaseError<DataT> implements IHttpError<DataT> {
  name = "HttpError";
  statusCode = 500;
  statusMessage?: string;

  static __http_error__ = true;

  constructor(message: string, opts: HttpErrorConstructorOptions<DataT> = {}) {
    super(message, omit(opts, ["statusCode", "statusMessage"]));

    if (opts.statusCode) {
      this.statusCode = opts.statusCode;
    }

    if (opts.statusMessage) {
      this.statusMessage = opts.statusMessage;
    }
  }

  toJSON() {
    const obj: Pick<HttpError<DataT>, "message" | "statusCode" | "statusMessage" | "data"> = {
      message: this.message,
      statusCode: this.statusCode,
    };

    if (this.statusMessage) {
      obj.statusMessage = this.statusMessage;
    }

    if (this.data !== undefined) {
      obj.data = this.data;
    }

    return obj;
  }
}

export function createHttpError<DataT = unknown>(
  input:
    | string
    | (Partial<HttpError<DataT>> & {
        status?: number;
        statusText?: string;
      }),
) {
  if (typeof input === "string") {
    return new HttpError<DataT>(input);
  }

  if (isHttpError<DataT>(input)) {
    return input;
  }

  const err = new HttpError<DataT>(input.message ?? input.statusMessage ?? "", {
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

  if (input.statusCode) {
    err.statusCode = input.statusCode;
  } else if (input.status) {
    err.statusCode = input.status;
  }

  if (input.statusMessage) {
    err.statusMessage = input.statusMessage;
  } else if (input.statusText) {
    err.statusMessage = input.statusText;
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

export function isHttpError<DataT = unknown>(input: any): input is HttpError<DataT> {
  return input?.constructor?.__http_error__ === true;
}
