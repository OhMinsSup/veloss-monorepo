# @veloss/assertion

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle size][bundle-src]][bundle-href]

데이터에 대한 타입을 검증하고 검증된 데이터를 안전한 타입으로 변환하는 라이브러리입니다.

## Usage

Install:

```bash
# npm
npm install @veloss/assertion

# yarn
yarn add @veloss/assertion

# pnpm
pnpm add @veloss/assertion
```

Import:

```ts
// ESM / Typescript
import { isNumber, ... } from "@veloss/assertion";

// CommonJS
const { isNumber, ... } = require("@veloss/assertion");
```

### `isNumber`

_Type_: `(value: any) => value is number`

validate if the value is a number.

```ts
function isNumber(value: any): value is number;
```

#### Example

```ts
import { isNumber } from "@veloss/assertion";

console.log(isNumber(1)); // true
console.log(isNumber("1")); // false
```

### `isNotNumber`

_Type_: `(value: any) => value is null | undefined | string | boolean | object | any[]`

validate if the value is not a number.

```ts
function isNotNumber(
  value: any
): value is null | undefined | string | boolean | object | any[];
```

#### Example

```ts
import { isNotNumber } from "@veloss/assertion";

console.log(isNotNumber(1)); // false
console.log(isNotNumber("1")); // true
```

### `isNumeric`

_Type_: `(value: any) => boolean`

validate if the value is a numeric value.

```ts
function isNumeric(value: any): boolean;
```

#### Example

```ts
import { isNumeric } from "@veloss/assertion";

console.log(isNumeric(1)); // true
console.log(isNumeric("1")); // true
console.log(isNumeric("1.1")); // true
console.log(isNumeric("1.1.1")); // false
```

### `isInteger`

_Type_: `(value: any) => value is number`

validate if the value is an integer.

```ts
function isInteger(value: any): value is number;
```

#### Example

```ts
import { isInteger } from "@veloss/assertion";

console.log(isInteger(1)); // true
console.log(isInteger(1.1)); // false
```

### `isFloat`

_Type_: `(value: any) => value is number`

validate if the value is a float.

```ts
function isFloat(value: any): value is number;
```

#### Example

```ts
import { isFloat } from "@veloss/assertion";

console.log(isFloat(1.1)); // true
console.log(isFloat(1)); // false
```

### `isArray`

_Type_: `<T>(value: any) => value is T[]`

validate if the value is an array.

```ts
function isArray<T>(value: any): value is T[];
```

#### Example

```ts
import { isArray } from "@veloss/assertion";

console.log(isArray([1, 2, 3])); // true
console.log(isArray("1,2,3".split(","))); // true
```

### `isEmptyArray`

_Type_: `(value: any) => value is []`

validate if the value is an empty array.

```ts
function isEmptyArray(value: any): value is [];
```

#### Example

```ts
import { isEmptyArray } from "@veloss/assertion";

console.log(isEmptyArray([])); // true
console.log(isEmptyArray([1, 2, 3])); // false
```

### `isFunction`

_Type_: `<T extends AnyFunction = AnyFunction>(value: any) => value is T`

validate if the value is a function.

```ts
function isFunction<T extends AnyFunction = AnyFunction>(
  value: any
): value is T;
```

#### Example

```ts
import { isFunction } from "@veloss/assertion";

console.log(isFunction(() => {})); // true
console.log(isFunction(function () {})); // true
```

### `isDefined`

_Type_: `<T>(value: T) => value is NonNullable<T>`

validate if the value is defined.

```ts
function isDefined<T>(value: T): value is NonNullable<T>;
```

#### Example

```ts
import { isDefined } from "@veloss/assertion";

console.log(isDefined(1)); // true
console.log(isDefined(null)); // false
```

### `isUndefined`

_Type_: `(value: any) => value is undefined`

validate if the value is undefined.

```ts
function isUndefined(value: any): value is undefined;
```

#### Example

```ts
import { isUndefined } from "@veloss/assertion";

console.log(isUndefined(undefined)); // true
console.log(isUndefined(null)); // false
```

### `isNull`

_Type_: `(value: any) => value is null`

validate if the value is null.

```ts
function isNull(value: any): value is null;
```

#### Example

```ts
import { isNull } from "@veloss/assertion";

console.log(isNull(null)); // true
console.log(isNull(undefined)); // false
```

### `isObject`

_Type_: `<T extends object = object>(value: any) => value is T`

validate if the value is an object.

```ts
function isObject<T extends object = object>(value: any): value is T;
```

#### Example

```ts
import { isObject } from "@veloss/assertion";

console.log(isObject({})); // true
console.log(isObject([])); // false
```

### `isEmptyObject`

_Type_: `(value: any) => value is {}`

validate if the value is an empty object.

```ts
function isEmptyObject(value: any): value is {};
```

#### Example

```ts
import { isEmptyObject } from "@veloss/assertion";

console.log(isEmptyObject({})); // true
console.log(isEmptyObject({ a: 1 })); // false
```

### `isNotEmptyObject`

_Type_: `(value: any) => value is object`

validate if the value is not an empty object.

```ts
function isNotEmptyObject(value: any): value is object;
```

#### Example

```ts
import { isNotEmptyObject } from "@veloss/assertion";

console.log(isNotEmptyObject({})); // false
console.log(isNotEmptyObject({ a: 1 })); // true
```

### `isString`

_Type_: `(value: any) => value is string`

validate if the value is a string.

```ts
function isString(value: any): value is string;
```

#### Example

```ts
import { isString } from "@veloss/assertion";

console.log(isString("")); // true
console.log(isString(1)); // false
```

### `isBoolean`

_Type_: `(value: any) => value is boolean`

validate if the value is a boolean.

```ts
function isBoolean(value: any): value is boolean;
```

#### Example

```ts
import { isBoolean } from "@veloss/assertion";

console.log(isBoolean(true)); // true
console.log(isBoolean(1)); // false
```

### `isSymbol`

_Type_: `(value: any) => value is symbol`

validate if the value is a symbol.

```ts
function isSymbol(value: any): value is symbol;
```

#### Example

```ts
import { isSymbol } from "@veloss/assertion";

console.log(isSymbol(Symbol())); // true
console.log(isSymbol(1)); // false
```

### `isDate`

_Type_: `(value: any) => value is Date`

validate if the value is a date.

```ts
function isDate(value: any): value is Date;
```

#### Example

```ts
import { isDate } from "@veloss/assertion";

console.log(isDate(new Date())); // true
console.log(isDate(1)); // false
```

### `isEmpty`

_Type_: `(value: any) => boolean`

validate if the value is empty.

```ts
function isEmpty(value: any): boolean;
```

#### Example

```ts
import { isEmpty } from "@veloss/assertion";

console.log(isEmpty("")); // true
console.log(isEmpty([])); // true
console.log(isEmpty({})); // true
console.log(isEmpty(null)); // true
console.log(isEmpty(undefined)); // true
console.log(isEmpty(0)); // false
console.log(isEmpty("1")); // false
```

### `isNullOrUndefined`

_Type_: `(value: any) => value is null | undefined`

validate if the value is null or undefined.

```ts
function isNullOrUndefined(value: any): value is null | undefined;
```

#### Example

```ts
import { isNullOrUndefined } from "@veloss/assertion";

console.log(isNullOrUndefined(null)); // true
console.log(isNullOrUndefined(undefined)); // true
console.log(isNullOrUndefined(0)); // false
```

### `isBrowser`

_Type_: `() => boolean`

validate if the code is running in a browser environment.

```ts
function isBrowser(): boolean;
```

#### Example

```ts
import { isBrowser } from "@veloss/assertion";

console.log(isBrowser()); // true
```

### `isNode`

_Type_: `() => boolean`

validate if the code is running in a Node.js environment.

```ts
function isNode(): boolean;
```

#### Example

```ts
import { isNode } from "@veloss/assertion";

console.log(isNode()); // false
```

### `isFalsy`

_Type_: `(value: any) => value is false | null | undefined | 0 | ""`

validate if the value is falsy.

```ts
function isFalsy(value: any): value is false | null | undefined | 0 | "";
```

#### Example

```ts
import { isFalsy } from "@veloss/assertion";

console.log(isFalsy(null)); // true
console.log(isFalsy(undefined)); // true
console.log(isFalsy(0)); // true
console.log(isFalsy("")); // true
console.log(isFalsy(1)); // false
```

### `isTruthy`

_Type_: `(value: any) => value is true`

validate if the value is truthy.

```ts
function isTruthy(value: any): value is true;
```

#### Example

```ts
import { isTruthy } from "@veloss/assertion";

console.log(isTruthy(true)); // true
console.log(isTruthy(1)); // false
```

### `isPromiseLike`

_Type_: `<T = any>(value: any) => value is PromiseLike<T>`

validate if the value is a promise-like object.

```ts
function isPromiseLike<T = any>(value: any): value is PromiseLike<T>;
```

#### Example

```ts
import { isPromiseLike } from "@veloss/assertion";

console.log(isPromiseLike(Promise.resolve())); // true
console.log(isPromiseLike({ then: () => {} })); // true
```

### `isPrimitive`

_Type_: `(value: any) => value is string | number | boolean | symbol | null | undefined`

validate if the value is a primitive value.

```ts
function isPrimitive(
  value: any
): value is string | number | boolean | symbol | null | undefined;
```

#### Example

```ts
import { isPrimitive } from "@veloss/assertion";

console.log(isPrimitive("")); // true
console.log(isPrimitive(1)); // true
console.log(isPrimitive(true)); // true
console.log(isPrimitive(Symbol())); // true
console.log(isPrimitive(null)); // true
console.log(isPrimitive(undefined)); // true
console.log(isPrimitive({})); // false
```

## 💻 Development

- Clone this repository
- Enable [Corepack](https://github.com/nodejs/corepack) using `corepack enable` (use `npm i -g corepack` for Node.js < 16.10)
- Install dependencies using `pnpm install`
- Run interactive tests using `pnpm test`
- Build the project using `pnpm build`
- format and lint the project using `pnpm format` and `pnpm lint` and `pnpm typecheck`

## License

[MIT](./LICENSE)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/@veloss/assertion?style=flat-square
[npm-version-href]: https://npmjs.com/package/@veloss/assertion
[npm-downloads-src]: https://img.shields.io/npm/dm/@veloss/assertion?style=flat-square
[npm-downloads-href]: https://npmjs.com/package/@veloss/assertion
[bundle-src]: https://flat.badgen.net/bundlephobia/minzip/@veloss/assertion
[bundle-href]: https://bundlephobia.com/package/@veloss/assertion
