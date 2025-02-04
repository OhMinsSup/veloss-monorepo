# @veloss/logger

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle size][bundle-src]][bundle-href]
[![MIT License][license-src]][license-src]

A logger library for Veloss.

## Usage

Install:

```bash
# npm
npm install @veloss/logger

# yarn
yarn add @veloss/logger

# pnpm
pnpm add @veloss/logger
```

Import:

```ts
// ESM / Typescript
import { createLogger, Logger } from "@veloss/logger";

// CommonJS
const { createLogger, Logger } = require("@veloss/logger");
```

## Example

**Basic Usage**

```ts
import { createLogger } from "@veloss/logger";
import { ConsoleTransport } from "@veloss/logger/transports";

const logger = createLogger({
  category: ["root"],
  transport: [new ConsoleTransport()],
});

const value = "Hello, World!";

logger.debug("A debug message.");

logger.debug`A debug message with ${value}.`;

logger.debug("A debug message with {value}.", { value });

logger.debug("A debug message with {value}.", () => ({
  value: expensiveComputation(),
}));
```

**Event Emitter**

Log events are emitted by the logger instance.

```ts
import { createLogger } from "@veloss/logger";

const logger = createLogger({
  category: ["root"],
  transport: [new ConsoleTransport()],
});

logger.onLog((record) => {
  console.log(record); // logger record
});

logger.debug("A debug message.");

logger.debug`A debug message with ${value}.`;

logger.debug("A debug message with {value}.", { value });

logger.debug("A debug message with {value}.", () => ({
  value: expensiveComputation(),
}));
```

**Custom Transport**

Create a custom transport by extending the `LoggerTransport` class.

```ts
import { LoggerTransport } from '@veloss/logger/transports';

export class CustomTransport extends LoggerTransport<Custom, unknown> {
  constructor(config) {
    super(config);
  }

  send(record: LogRecord): void {
    if (!this.enabled) {
      return;
    }

    switch (record.level) {
      case LogLevel.debug:
        this.logger.debug(...this.formatter(record));
        break;
      case LogLevel.info:
        this.logger.info(...this.formatter(record));
        break;
      case LogLevel.warn:
        this.logger.warn(...this.formatter(record));
        break;
      case LogLevel.error:
        this.logger.error(...this.formatter(record));
        break;
      case LogLevel.fatal:
        this.logger.debug(...this.formatter(record));
        break;
      case LogLevel.trace:
        this.logger.trace(...this.formatter(record));
        break;
      default:
        break;
    }
  }

  formatter(record: LogRecord): readonly unknown[] {
    return [...];
  }
}
```

## License

[MIT](./LICENSE)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/@veloss/logger?style=flat-square
[npm-version-href]: https://npmjs.com/package/@veloss/logger
[npm-downloads-src]: https://img.shields.io/npm/dm/@veloss/logger?style=flat-square
[npm-downloads-href]: https://npmjs.com/package/@veloss/logger
[bundle-src]: https://flat.badgen.net/bundlephobia/minzip/@veloss/logger
[bundle-href]: https://bundlephobia.com/package/@veloss/logger
[license-src]: https://img.shields.io/npm/l/@veloss/logger?style=flat-square
