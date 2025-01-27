# @veloss/assertion

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]

데이터에 대한 타입을 검증하고 검증된 데이터를 안전한 타입으로 변환하는 라이브러리입니다.

## 🚀 Quick Start

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
import { isNumber } from "@veloss/assertion";

// CommonJS
const { isNumber } = require("@veloss/assertion");
```

## 📚 Documentation

### isNumber

```ts
import { isNumber } from "@veloss/assertion";

isNumber(1); // true

isNumber("1"); // false
```

### isNotNumber

```ts
import { isNotNumber } from "@veloss/assertion";

isNotNumber(1); // false

isNotNumber("1"); // true
```

### isNumeric

```ts
import { isNumeric } from "@veloss/assertion";

isNumeric(1); // true

isNumeric("1"); // true
```

### isArray

```ts
import { isArray } from "@veloss/assertion";

isArray([]); // true

isArray({}); // false
```

### isEmptyArray

```ts
import { isEmptyArray } from "@veloss/assertion";

isEmptyArray([]); // true

isEmptyArray([1]); // false
```

### isFunction

```ts
import { isFunction } from "@veloss/assertion";

isFunction(() => {}); // true

isFunction({}); // false
```

### isDefined

```ts
import { isDefined } from "@veloss/assertion";

isDefined(1); // true

isDefined(null); // true

isDefined(undefined); // false
```

### isUndefined

```ts
import { isUndefined } from "@veloss/assertion";

isUndefined(1); // false

isUndefined(null); // false

isUndefined(undefined); // true
```

### isObject

```ts
import { isObject } from "@veloss/assertion";

isObject({}); // true

isObject([]); // false
```

### isEmptyObject

```ts
import { isEmptyObject } from "@veloss/assertion";

isEmptyObject({}); // true

isEmptyObject({ a: 1 }); // false
```

### isNotEmptyObject

```ts
import { isNotEmptyObject } from "@veloss/assertion";

isNotEmptyObject({}); // false

isNotEmptyObject({ a: 1 }); // true
```

### isNull

```ts
import { isNull } from "@veloss/assertion";

isNull(null); // true

isNull(undefined); // false
```

### isString

```ts
import { isString } from "@veloss/assertion";

isString("1"); // true

isString(1); // false
```

### isBoolean

```ts
import { isBoolean } from "@veloss/assertion";

isBoolean(true); // true

isBoolean(1); // false
```

### isEmpty

```ts
import { isEmpty } from "@veloss/assertion";

isEmpty(""); // true

isEmpty([]); // true

isEmpty({}); // true

isEmpty(null); // true

isEmpty(undefined); // true

isEmpty(0); // false
```

### isNullOrUndefined

```ts
import { isNullOrUndefined } from "@veloss/assertion";

isNullOrUndefined(null); // true

isNullOrUndefined(undefined); // true

isNullOrUndefined(0); // false
```

### canUseDOM

```ts
import { canUseDOM } from "@veloss/assertion";

// Node.js
canUseDOM(); // false

// Browser
canUseDOM(); // true
```

### isBrowser

```ts
import { isBrowser } from "@veloss/assertion";

// Node.js
isBrowser(); // false

// Browser
isBrowser(); // true
```

### isTrusted

```ts
import { isTrusted } from "@veloss/assertion";

isTrusted(true); // true

isTrusted(false); // false
```

### isFalsy

```ts
import { isFalsy } from "@veloss/assertion";

isFalsy(false); // true

isFalsy(0); // true
```

### isPromiseLike

```ts
import { isPromiseLike } from "@veloss/assertion";

isPromiseLike(Promise.resolve()); // true

isPromiseLike({ then: () => {} }); // true

isPromiseLike({}); // false
```

### Primitive

```ts
import { Primitive } from "@veloss/assertion";

const a: Primitive = 1;

const b: Primitive = "1";

const c: Primitive = true;

const d: Primitive = null;

const e: Primitive = undefined;
```

## License

[MIT](./LICENSE)

```

```

```

```
