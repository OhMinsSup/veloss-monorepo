# Base error

This document describes the properties and usage of BaseError.

## Examples

### Simple example

```ts
import { BaseError } from "@veloss/error";

try {
  // ...
} catch (cause) {
  throw new BaseError("Could not read the file.", { cause });
}
```

```ts
import { createBaseError } from "@veloss/error";

try {
  // ...
} catch (cause) {
  throw createBaseError({
    message: "Could not read the file.",
    cause,
  });
}
```

```ts
import { isBaseError } from "@veloss/error";

try {
  const data = await func();
} catch (e) {
  if (isBaseError(e)) {
    const e = e.toJSON();
    console.log(e);
  }
}
```

## API

```ts
interface BaseErrorConstructorOptions<DataT = unknown> {
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

class BaseError<DataT = unknown> extends Error implements IBaseError<DataT> {
  name: string;
  fatal: boolean;
  unhandled: boolean;
  data?: DataT;
  cause?: unknown;
  code?: number;
  static __base_error__: boolean;
  constructor(message: string, opts?: BaseErrorConstructorOptions<DataT>);
  toJSON(): Pick<BaseError<DataT>, "message" | "data">;
}

function createBaseError<DataT = unknown>(
  input: string | Partial<BaseError<DataT>>
): BaseError<DataT>;

function isBaseError<DataT = unknown>(input: any): input is BaseError<DataT>;
```

### name

_Type_: `string`

Error name. This is used to identify the error class and should be unique among

```ts
const error = new BaseError("message");
error.name; // "BaseError"
```

### fatal

_Type_: `boolean`

Whether the error is fatal. This is used to determine whether the process should

```ts
const error = new BaseError("message", { fatal: true });
error.fatal; // true
```

### unhandled

_Type_: `boolean`

Whether the error is unhandled. This is used to determine whether the error was

```ts
const error = new BaseError("message", { unhandled: true });
error.unhandled; // true
```

### data

_Type_: `DataT`

Additional data. This can be any type and is used to store any additional

```ts
const error = new BaseError("message", { data: { key: "value" } });
error.data; // { key: "value" }
```

### cause

_Type_: `unknown`

The error that caused this error. This is used to store the error that caused

```ts
const error = new BaseError("message", { cause: new Error("cause") });
error.cause; // Error: cause
```

### code

_Type_: `number`

Error code. This is used to store an error code and is used to identify the

```ts
const error = new BaseError("message", { code: 404 });
error.code; // 404
```

### toJSON

_Type_: `() => Pick<BaseError<DataT>, "message" | "data">`

Converts the error to a JSON-serializable object. This is used to serialize the

```ts
const error = new BaseError("message", { data: { key: "value" } });

error.toJSON(); // { message: "message", data: { key: "value" } }
```

### staticMethods.base_error

_Type_: `boolean`

Whether the error is a `BaseError`. This is used to determine whether an error

```ts
BaseError.__base_error__; // true
```

## Related

- [createBaseError](#createbaseerror)
- [isBaseError](#isbaseerror)

## createBaseError

```ts
function createBaseError<DataT = unknown>(
  input: string | Partial<BaseError<DataT>>
): BaseError<DataT>;
```

Creates a new `BaseError` instance. This is used to create a new `BaseError`

```ts
const error = createBaseError("message");
error instanceof BaseError; // true
```

```ts
const error = createBaseError({ message: "message" });
error instanceof BaseError; // true
```

## isBaseError

```ts
function isBaseError<DataT = unknown>(input: any): input is BaseError<DataT>;
```

Checks whether the input is a `BaseError`. This is used to determine whether an

```ts
const error = new BaseError("message");

isBaseError(error); // true
```

```ts
isBaseError(new Error("message")); // false
```

## See also

- [BaseError](#baseerror)

## License

[MIT](../LICENSE)
