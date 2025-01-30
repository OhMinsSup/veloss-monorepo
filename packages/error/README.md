# @veloss/error

간단하고 쉽게 확장 가능한 방식으로 오류를 처리 할 수 있도록 도와주는 라이브러리입니다.

## 🚀 Quick Start

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
import { BaseError, createBaseError, isBaseError } from "@veloss/error";

// CommonJS
const { BaseError, createBaseError, isBaseError } = require("@veloss/error");
```

## 📚 Documentation

- [`BaseError`](docs/base-error.md): Base class for all errors
- [`AuthError`](docs/auth-error.md): Error class for auth errors
- [`HttpError`](docs/http-error.md): Error class for HTTP errors

## License

[MIT](./LICENSE)
