import { BaseError } from "../base";
import { omit } from "../utils";

interface IHttpError<DataT = unknown> extends BaseError<DataT> {
  /**
   * The http status code {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status}
   */
  statusCode: number;
  /**
   * The http status message {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status}
   */
  statusMessage?: string;
  /**
   * @override
   * Convert the error to a JSON object
   * @returns The JSON object representing the error
   */
  toJSON(): Pick<IHttpError<DataT>, "message" | "statusCode" | "statusMessage" | "data">;
}

interface HttpErrorConstructorOptions<DataT = unknown> extends Omit<Partial<IHttpError<DataT>>, "name" | "toJSON"> {}

/**
 * @class HttpError
 * Http error class
 * @template DataT - The type of the additional data
 * @extends BaseError<DataT> - The base error class {@link BaseError<DataT>}
 * @implements IHttpError<DataT> - The http error interface {@link IHttpError<DataT>}
 */
export class HttpError<DataT = unknown> extends BaseError<DataT> implements IHttpError<DataT> {
  name = "HttpError";

  statusCode = 500;

  statusMessage?: string;

  /**
   * Whether the error is an http error
   */
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

/**
 * Create an http error
 * @param input - The input to create the http error
 * @returns The http error
 * @template DataT - The type of the data
 *
 * ```ts
 * const error = createHttpError("Http error");
 * console.log(error instanceof HttpError); // true
 * console.log(error.message); // "Http error"
 * ```
 */
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

/**
 * Check whether the input is an http error
 * @param input - The input to check
 * @returns The input is an http error or not
 * @template DataT - The type of the data
 *
 * ```ts
 * const error = createHttpError("Http error");
 * console.log(isHttpError(error)); // true
 * console.log(isHttpError(new Error())); // false
 * ```
 */
export function isHttpError<DataT = unknown>(input: any): input is HttpError<DataT> {
  return input?.constructor?.__http_error__ === true;
}
