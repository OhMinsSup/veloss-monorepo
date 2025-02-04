import type { LogLevel } from "./level";
import type { Logger } from "./logger";
import type { LoggerTransport } from "./transport";

export type LogTemplatePrefix = (message: TemplateStringsArray, ...values: unknown[]) => unknown[];

export type LogCallback = (prefix: LogTemplatePrefix) => unknown[];

export type LogContext<T extends Record<string, any>> = Map<keyof T, T[keyof T]>;

export enum TYPE {
  /**
   * Raw text
   */
  literal = 0,
  /**
   * Variable w/o any format, e.g `var` in `this is a {var}`
   */
  argument = 1,
}

export enum ErrorKind {
  /** Argument is unclosed (e.g. `{0`) */
  EXPECT_ARGUMENT_CLOSING_BRACE = 1,
  /** Argument is empty (e.g. `{}`). */
  EMPTY_ARGUMENT = 2,
  /** Argument is malformed (e.g. `{foo!}``) */
  MALFORMED_ARGUMENT = 3,
}

export interface LogRecord {
  /**
   * The category of the logger that produced the log record.
   */
  readonly category: readonly string[];

  /**
   * The log level.
   */
  readonly level: LogLevel;

  /**
   * The prefix of the log record.
   */
  readonly prefix: string;

  /**
   * The log message.  This is the result of substituting the message template
   * with the values.  The number of elements in this array is always odd,
   * with the message template values interleaved between the substitution
   * values.
   */
  readonly message: readonly unknown[];

  /**
   * The raw log message.  This is the original message template without any
   * further processing.  It can be either:
   *
   * - A string without any substitutions if the log record was created with
   *   a method call syntax, e.g., "Hello, {name}!" for
   *   `logger.info("Hello, {name}!", { name })`.
   * - A template string array if the log record was created with a tagged
   *   template literal syntax, e.g., `["Hello, ", "!"]` for
   *   ``logger.info`Hello, ${name}!```.
   *
   */
  readonly rawMessage: string | TemplateStringsArray;

  /**
   * The timestamp of the log record in milliseconds since the Unix epoch.
   */
  readonly timestamp: number;

  /**
   * The extra properties of the log record.
   */
  readonly properties: Record<string, unknown>;
}

export interface LogSubscription {
  /**
   * The subscriber CUID.
   */
  id: string;

  /**
   * The callback function to be called when a log record is emitted.
   */
  callback: (event: LogLevel, record: LogRecord) => void;

  /**
   * Call this to remove the listener.
   */
  unsubscribe: () => void;
}

export interface ILogger<T extends Record<string, unknown> = Record<string, unknown>> {
  /**
   * The category of the logger.  It is an array of strings.
   */
  readonly category: readonly string[];

  /**
   * Log a debug message.  Use this as a template string prefix.
   *
   * ```typescript
   * logger.debug `A debug message with ${value}.`;
   * ```
   *
   * @param message The message template strings array.
   * @param values The message template values.
   */
  debug(message: TemplateStringsArray, ...values: readonly unknown[]): void;

  /**
   * Log a debug message with properties.
   *
   * ```typescript
   * logger.debug('A debug message with {value}.', { value });
   * ```
   *
   * If the properties are expensive to compute, you can pass a callback that
   * returns the properties:
   *
   * ```typescript
   * logger.debug(
   *   'A debug message with {value}.',
   *   () => ({ value: expensiveComputation() })
   * );
   * ```
   *
   * @param message The message template.  Placeholders to be replaced with
   *                `values` are indicated by keys in curly braces (e.g.,
   *                `{value}`).
   * @param properties The values to replace placeholders with.  For lazy
   *                   evaluation, this can be a callback that returns the
   *                   properties.
   */
  debug(message: string, properties?: Record<string, unknown> | (() => Record<string, unknown>)): void;

  /**
   * Lazily log a debug message.  Use this when the message values are expensive
   * to compute and should only be computed if the message is actually logged.
   *
   * ```typescript
   * logger.debug(l => l`A debug message with ${expensiveValue()}.`);
   * ```
   *
   * @param callback A callback that returns the message template prefix.
   * @throws {TypeError} If no log record was made inside the callback.
   */
  debug(callback: LogCallback): void;

  /**
   * Log an informational message.  Use this as a template string prefix.
   *
   * ```typescript
   * logger.info `An info message with ${value}.`;
   * ```
   *
   * @param message The message template strings array.
   * @param values The message template values.
   */
  info(message: TemplateStringsArray, ...values: readonly unknown[]): void;

  /**
   * Log an informational message with properties.
   *
   * ```typescript
   * logger.info('An info message with {value}.', { value });
   * ```
   *
   * If the properties are expensive to compute, you can pass a callback that
   * returns the properties:
   *
   * ```typescript
   * logger.info(
   *   'An info message with {value}.',
   *   () => ({ value: expensiveComputation() })
   * );
   * ```
   *
   * @param message The message template.  Placeholders to be replaced with
   *                `values` are indicated by keys in curly braces (e.g.,
   *                `{value}`).
   * @param properties The values to replace placeholders with.  For lazy
   *                   evaluation, this can be a callback that returns the
   *                   properties.
   */
  info(message: string, properties?: Record<string, unknown> | (() => Record<string, unknown>)): void;

  /**
   * Lazily log an informational message.  Use this when the message values are
   * expensive to compute and should only be computed if the message is actually
   * logged.
   *
   * ```typescript
   * logger.info(l => l`An info message with ${expensiveValue()}.`);
   * ```
   *
   * @param callback A callback that returns the message template prefix.
   * @throws {TypeError} If no log record was made inside the callback.
   */
  info(callback: LogCallback): void;

  /**
   * Log a warning message.  Use this as a template string prefix.
   *
   * ```typescript
   * logger.warn `A warning message with ${value}.`;
   * ```
   *
   * @param message The message template strings array.
   * @param values The message template values.
   */
  warn(message: TemplateStringsArray, ...values: readonly unknown[]): void;

  /**
   * Log a warning message with properties.
   *
   * ```typescript
   * logger.warn('A warning message with {value}.', { value });
   * ```
   *
   * If the properties are expensive to compute, you can pass a callback that
   * returns the properties:
   *
   * ```typescript
   * logger.warn(
   *   'A warning message with {value}.',
   *   () => ({ value: expensiveComputation() })
   * );
   * ```
   *
   * @param message The message template.  Placeholders to be replaced with
   *                `values` are indicated by keys in curly braces (e.g.,
   *                `{value}`).
   * @param properties The values to replace placeholders with.  For lazy
   *                   evaluation, this can be a callback that returns the
   *                   properties.
   */
  warn(message: string, properties?: Record<string, unknown> | (() => Record<string, unknown>)): void;

  /**
   * Lazily log a warning message.  Use this when the message values are
   * expensive to compute and should only be computed if the message is actually
   * logged.
   *
   * ```typescript
   * logger.warn(l => l`A warning message with ${expensiveValue()}.`);
   * ```
   *
   * @param callback A callback that returns the message template prefix.
   * @throws {TypeError} If no log record was made inside the callback.
   */
  warn(callback: LogCallback): void;

  /**
   * Log an error message.  Use this as a template string prefix.
   *
   * ```typescript
   * logger.error `An error message with ${value}.`;
   * ```
   *
   * @param message The message template strings array.
   * @param values The message template values.
   */
  error(message: TemplateStringsArray, ...values: readonly unknown[]): void;

  /**
   * Log an error message with properties.
   *
   * ```typescript
   * logger.warn('An error message with {value}.', { value });
   * ```
   *
   * If the properties are expensive to compute, you can pass a callback that
   * returns the properties:
   *
   * ```typescript
   * logger.error(
   *   'An error message with {value}.',
   *   () => ({ value: expensiveComputation() })
   * );
   * ```
   *
   * @param message The message template.  Placeholders to be replaced with
   *                `values` are indicated by keys in curly braces (e.g.,
   *                `{value}`).
   * @param properties The values to replace placeholders with.  For lazy
   *                   evaluation, this can be a callback that returns the
   *                   properties.
   */
  error(message: string, properties?: Record<string, unknown> | (() => Record<string, unknown>)): void;

  /**
   * Lazily log an error message.  Use this when the message values are
   * expensive to compute and should only be computed if the message is actually
   * logged.
   *
   * ```typescript
   * logger.error(l => l`An error message with ${expensiveValue()}.`);
   * ```
   *
   * @param callback A callback that returns the message template prefix.
   * @throws {TypeError} If no log record was made inside the callback.
   */
  error(callback: LogCallback): void;

  /**
   * Log a fatal error message.  Use this as a template string prefix.
   *
   * ```typescript
   * logger.fatal `A fatal error message with ${value}.`;
   * ```
   *
   * @param message The message template strings array.
   * @param values The message template values.
   */
  fatal(message: TemplateStringsArray, ...values: readonly unknown[]): void;

  /**
   * Log a fatal error message with properties.
   *
   * ```typescript
   * logger.warn('A fatal error message with {value}.', { value });
   * ```
   *
   * If the properties are expensive to compute, you can pass a callback that
   * returns the properties:
   *
   * ```typescript
   * logger.fatal(
   *   'A fatal error message with {value}.',
   *   () => ({ value: expensiveComputation() })
   * );
   * ```
   *
   * @param message The message template.  Placeholders to be replaced with
   *                `values` are indicated by keys in curly braces (e.g.,
   *                `{value}`).
   * @param properties The values to replace placeholders with.  For lazy
   *                   evaluation, this can be a callback that returns the
   *                   properties.
   */
  fatal(message: string, properties?: Record<string, unknown> | (() => Record<string, unknown>)): void;

  /**
   * Lazily log a fatal error message.  Use this when the message values are
   * expensive to compute and should only be computed if the message is actually
   * logged.
   *
   * ```typescript
   * logger.fatal(l => l`A fatal error message with ${expensiveValue()}.`);
   * ```
   *
   * @param callback A callback that returns the message template prefix.
   * @throws {TypeError} If no log record was made inside the callback.
   */
  fatal(callback: LogCallback): void;

  /**
   * Subscribe to log events.
   * @param callback The callback function to be called when a log record is emitted.
   * @returns An object with the subscription id and an unsubscribe function.
   * ```typescript
   * const { subscription } = logger.onLog((event, record) => {
   *  console.log(event, record);
   * });
   * ```
   * To unsubscribe, call the `unsubscribe` function.
   * ```typescript
   * subscription.unsubscribe();
   * ```
   */
  onLog(callback: (event: LogLevel, record: LogRecord) => void): {
    subscription: LogSubscription;
  };
}

export type LoggerConfig<T extends Record<string, unknown> = Record<string, unknown>> = {
  /**
   * The prefix of the log record.
   */
  prefix?: string;
  /**
   * If false, the logger will not send logs to the transports.
   */
  enabled?: boolean;
  /**
   * The transport(s) that implements a logging library to send logs to.
   * Can be a single transport or an array of transports.
   */
  transports?: LoggerTransport<any, any>[] | LoggerTransport<any, any>;
  /**
   * The category of the logger that produced the log record.
   */
  category?: string[];
};
