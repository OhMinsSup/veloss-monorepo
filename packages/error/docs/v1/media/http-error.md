# Http error

This document describes the properties and usage of HttpError.

## Examples

### Simple example

```ts
import { HttpError } from "@veloss/error/http";

try {
  // ...
} catch (cause) {
  throw new HttpError("Could not read the file.", { cause });
}
```

```ts
import { createHttpError } from "@veloss/error/http";

try {
  // ...
} catch (cause) {
  throw createHttpError({
    message: "Could not read the file.",
    cause,
  });
}
```

```ts
import { isHttpError } from "@veloss/error/http";

try {
  const data = await func();
} catch (e) {
  if (isHttpError(e)) {
    const e = e.toJSON();
    console.log(e);
  }
}
```

## API

```ts
interface IHttpError<DataT = unknown> extends BaseError<DataT> {
  statusCode: number;
  statusMessage?: string;
  toJSON(): Pick<
    IHttpError<DataT>,
    "message" | "statusCode" | "statusMessage" | "data"
  >;
}

interface HttpErrorConstructorOptions<DataT = unknown>
  extends BaseErrorConstructorOptions<DataT> {
  statusCode?: number;
  statusMessage?: string;
}

class HttpError<DataT = unknown>
  extends BaseError<DataT>
  implements IHttpError<DataT>
{
  name: string;
  statusCode: number;
  statusMessage?: string;
  static __http_error__: boolean;
  constructor(message: string, opts?: HttpErrorConstructorOptions<DataT>);
  toJSON(): Pick<
    HttpError<DataT>,
    "message" | "data" | "statusCode" | "statusMessage"
  >;
}

function createHttpError<DataT = unknown>(
  input:
    | string
    | (Partial<HttpError<DataT>> & {
        status?: number;
        statusText?: string;
      })
): HttpError<DataT>;

function isHttpError<DataT = unknown>(input: any): input is HttpError<DataT>;
```

### name

_Type_: `string`

Error name. This is used to identify the error class and should be unique among

```ts
const error = new HttpError("message");
error.name; // "HttpError"
```

### fatal

_Type_: `boolean`

Whether the error is fatal. This is used to determine whether the process should

```ts
const error = new HttpError("message", { fatal: true });
error.fatal; // true
```

### unhandled

_Type_: `boolean`

Whether the error is unhandled. This is used to determine whether the error was

```ts
const error = new HttpError("message", { unhandled: true });
error.unhandled; // true
```

### data

_Type_: `DataT`

Additional data. This can be any type and is used to store any additional

```ts
const error = new HttpError("message", { data: { key: "value" } });
error.data; // { key: "value" }
```

### cause

_Type_: `unknown`

The error that caused this error. This is used to store the error that caused

```ts
const error = new HttpError("message", { cause: new Error("cause") });
error.cause; // Error: cause
```

### code

_Type_: `number`

Error code. This is used to store an error code and is used to identify the

```ts
const error = new HttpError("message", { code: 404 });
error.code; // 404
```

### toJSON

_Type_: `() => Pick<HttpError<DataT>, "message" | "statusCode" | "statusMessage" | "data">`

Converts the error to a JSON-serializable object. This is used to serialize the

```ts
const error = new HttpError("message", { data: { key: "value" } });

error.toJSON(); // { message: "message", data: { key: "value" } }
```

### staticMethods.http_error

_Type_: `boolean`

Whether the error is a `HttpError`. This is used to determine whether an error

```ts
HttpError.__http_error__; // true
```

### statusCode

_Type_: `number`

HTTP status code. This is used to store an HTTP status code and is used to

```ts
const error = new HttpError("message", { statusCode: 404 });
error.statusCode; // 404
```

### statusMessage

_Type_: `string`

HTTP status message. This is used to store an HTTP status message and is used to

```ts
const error = new HttpError("message", { statusMessage: "Not Found" });
error.statusMessage; // "Not Found"
```

## Related

- [createHttpError](#createhttperror)
- [isHttpError](#ishttperror)

## createHttpError

```ts
function createHttpError<DataT = unknown>(
  input:
    | string
    | (Partial<HttpError<DataT>> & {
        status?: number;
        statusText?: string;
      })
): HttpError<DataT>;
```

Creates a new `HttpError` instance. This is used to create a new `HttpError` with

```ts
const error = createHttpError("message");

error instanceof HttpError; // true
```

```ts
const error = createHttpError({ message: "message" });

error instanceof HttpError; // true
```

## isHttpError

```ts
function isHttpError<DataT = unknown>(input: any): input is HttpError<DataT>;
```

Checks whether the input is a `HttpError`. This is used to determine whether an

```ts
const error = new HttpError("message");

isHttpError(error); // true
```

```ts
isHttpError(new Error("message")); // false
```

## See also

- [HttpError](#httperror)

## License

[MIT](../LICENSE)
