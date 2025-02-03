# @veloss/error

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle size][bundle-src]][bundle-href]
[![MIT License][license-src]][license-src]

간단하고 쉽게 확장 가능한 방식으로 오류를 처리 할 수 있도록 도와주는 라이브러리입니다.

## Usage

Install:

```bash
# npm
npm install @veloss/error

# yarn
yarn add @veloss/error

# pnpm
pnpm add @veloss/error
```

Import:

```ts
// ESM / Typescript
import { BaseError, HttpError, AuthError, ... } from "@veloss/error";

// CommonJS
const { BaseError, HttpError, AuthError, ... } = require("@veloss/error");
```

## `BaseError`

Base error class. This is used to create a new error class that can be extended

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

**Basic Usage**

```ts
const error = new BaseError("message");
```

**createBaseError**

`CreateBaseError` is a helper function that creates a new error class that extends `BaseError`. This is used to create a new error class that can be extended and is used to create a new error class that can be extended.

```ts
import { createBaseError } from "@veloss/error";

const error = createBaseError("CustomError");
```

**isBaseError**

`isBaseError` is a helper function that checks whether an error is an instance of `BaseError`. This is used to determine whether an error is an instance of `BaseError` and is used to determine whether an error is an instance of `BaseError`.

```ts
import { isBaseError } from "@veloss/error";

const error = new BaseError("message");

isBaseError(error); // true
```

## `HttpError`

HTTP error class. `BaseError` is extended to create a new error class that can be extended and is used to HTTP errors.

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

**Basic Usage**

```ts
const error = new HttpError("message", { statusCode: 404 });
```

**createHttpError**

`createHttpError` is a helper function that creates a new error class that extends `HttpError`. This is used to create a new error class that can be extended and is used to create a new error class that can be extended.

```ts
import { createHttpError } from "@veloss/error";

const error = createHttpError("CustomHttpError", { statusCode: 404 });
```

**isHttpError**

`isHttpError` is a helper function that checks whether an error is an instance of `HttpError`. This is used to determine whether an error is an instance of `HttpError` and is used to determine whether an error is an instance of `HttpError`.

```ts
import { isHttpError } from "@veloss/error";

const error = new HttpError("message", { statusCode: 404 });

isHttpError(error); // true
```

## `AuthError`

Authentication error class. `BaseError` is extended to create a new error class that can be extended and is used to authentication errors.

### staticMethods.auth_error

_Type_: `boolean`

Whether the error is a `AuthError`. This is used to determine whether an error

```ts
AuthError.__auth_error__; // true
```

### errorCode

_Type_: `AuthErrorCode`

Error code. This is used to store an error code and is used to identify the

```ts
const error = new AuthError("message", { errorCode: "unexpected_failure" });
error.errorCode; // "unexpected_failure"
```

### statusCode

_Type_: `number`

HTTP status code. This is used to store an HTTP status code and is used to

```ts
const error = new AuthError("message", { statusCode: 404 });
error.statusCode; // 404
```

**Basic Usage**

```ts
const error = new AuthError("message", { errorCode: "unexpected_failure" });
```

**createAuthError**

`createAuthError` is a helper function that creates a new error class that extends `AuthError`. This is used to create a new error class that can be extended and is used to create a new error class that can be extended.

```ts
import { createAuthError } from "@veloss/error";

const error = createAuthError("CustomAuthError", {
  errorCode: "unexpected_failure",
});
```

**isAuthError**

`isAuthError` is a helper function that checks whether an error is an instance of `AuthError`. This is used to determine whether an error is an instance of `AuthError` and is used to determine whether an error is an instance of `AuthError`.

```ts
import { isAuthError } from "@veloss/error";

const error = new AuthError("message", { errorCode: "unexpected_failure" });

isAuthError(error); // true
```

## License

[MIT](./LICENSE)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/@veloss/error?style=flat-square
[npm-version-href]: https://npmjs.com/package/@veloss/error
[npm-downloads-src]: https://img.shields.io/npm/dm/@veloss/error?style=flat-square
[npm-downloads-href]: https://npmjs.com/package/@veloss/error
[bundle-src]: https://flat.badgen.net/bundlephobia/minzip/@veloss/error
[bundle-href]: https://bundlephobia.com/package/@veloss/error
[license-src]: https://img.shields.io/npm/l/@veloss/error?style=flat-square
