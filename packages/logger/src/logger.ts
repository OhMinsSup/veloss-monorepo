import { LoggerTransportManager } from "./transports.manager";
import type { LogCallback, LogRecord, LogSubscription, LoggerConfig, ILogger } from "./types";
import { createContextManager, type ContextManager } from "./context";
import { createLoggerId } from "./id";
import { LoggerParser } from "./parser";
import { LoggerPrint } from "./print";
import { compareLogLevel, LogLevel } from "./level";

const DEFAULT_LOGGER_PREFIX: string = "[Logger]";

export class Logger<T extends Record<string, unknown> = Record<string, unknown>> implements ILogger<T> {
  private prefix: string;

  readonly parent?: ILogger<T> | undefined;

  private enabled?: boolean | undefined;

  private transport: LoggerTransportManager;

  private print: LoggerPrint;

  private stateChangeEmitters: Map<string, LogSubscription> = new Map<string, LogSubscription>();

  readonly category: readonly string[];

  context: ContextManager<T>;

  lowestLevel: LogLevel | null = LogLevel.debug;

  constructor(config?: LoggerConfig<T>) {
    this.enabled = config?.enabled ?? true;
    this.parent = config?.parent;
    this.prefix = config?.prefix ?? DEFAULT_LOGGER_PREFIX;
    this.category = config?.category ?? [];

    this.context = createContextManager<T>();

    this.print = new LoggerPrint();

    this.transport = new LoggerTransportManager({ transports: config?.transports });
  }

  private log(level: LogLevel, rawMessage: string, properties: T | (() => T)): void {
    if (!this.enabled) {
      return;
    }

    const parser = new LoggerParser();
    const printASTtoArray = this.print.printASTtoArray.bind(this.print);
    const implicitContext = this.context.getStore() ?? this.context.createEmptyContext();
    const timestamp = Date.now();
    let cachedProps: Record<string, unknown> | undefined = undefined;
    const record: LogRecord =
      typeof properties === "function"
        ? {
            category: this.category,
            level,
            prefix: this.prefix,
            timestamp,
            get message() {
              const parsed = parser.parse(rawMessage, this.properties);
              return parsed.val ? printASTtoArray(parsed.val) : [];
            },
            rawMessage,
            get properties() {
              if (cachedProps == null) {
                cachedProps = {
                  ...implicitContext,
                  ...properties(),
                };
              }
              return cachedProps;
            },
          }
        : (() => {
            const parsed = parser.parse(rawMessage, {
              ...implicitContext,
              ...properties,
            });
            const message = parsed.val ? printASTtoArray(parsed.val) : [];
            return {
              category: this.category,
              level,
              prefix: this.prefix,
              timestamp,
              message,
              rawMessage,
              properties: { ...implicitContext, ...properties },
            };
          })();

    this.emit(record);
    this.notifyAllSubscribers(level, record);
  }

  private logLazy(level: LogLevel, callback: LogCallback, properties: Record<string, unknown> = {}): void {
    if (!this.enabled) {
      return;
    }

    const implicitContext = this.context.getStore() ?? this.context.createEmptyContext();
    const timestamp = Date.now();

    let rawMessage: TemplateStringsArray | undefined = undefined;
    let msg: unknown[] | undefined = undefined;

    const printASTtoArray = this.print.printASTtoArray.bind(this.print);
    const parse = new LoggerParser();

    function realizeMessage(): [unknown[], TemplateStringsArray] {
      if (msg == null || rawMessage == null) {
        msg = callback((tpl, ...values) => {
          rawMessage = tpl;
          const parsed = parse.parseTemplate(tpl, values);
          return parsed.val ? printASTtoArray(parsed.val) : [];
        });
        if (rawMessage == null) {
          throw new TypeError("No log record was made.");
        }
      }
      return [msg, rawMessage];
    }

    const record = {
      category: this.category,
      prefix: this.prefix,
      level,
      get message() {
        return realizeMessage().at(0) as unknown[];
      },
      get rawMessage() {
        return realizeMessage().at(1) as TemplateStringsArray;
      },
      timestamp,
      properties: { ...implicitContext, ...properties },
    };

    this.emit(record);
    this.notifyAllSubscribers(level, record);
  }

  private logTemplate(
    level: LogLevel,
    messageTemplate: TemplateStringsArray,
    values: unknown[],
    properties = {} as T,
  ): void {
    if (!this.enabled) {
      return;
    }

    const timestamp = Date.now();
    const implicitContext = this.context.getStore() ?? this.context.createEmptyContext();
    const parser = new LoggerParser();

    const pared = parser.parseTemplate(messageTemplate, values);
    const printASTtoArray = this.print.printASTtoArray.bind(this.print);
    const message = pared.val ? printASTtoArray(pared.val) : [];

    const record = {
      category: this.category,
      prefix: this.prefix,
      level,
      message,
      rawMessage: messageTemplate,
      timestamp,
      properties: { ...implicitContext, ...properties },
    };

    this.emit(record);
    this.notifyAllSubscribers(level, record);
  }

  debug(message: TemplateStringsArray | string | LogCallback, ...values: unknown[]): void {
    if (typeof message === "string") {
      const properties = (values[0] ?? {}) as unknown as T;
      this.log(LogLevel.debug, message, properties);
    } else if (typeof message === "function") {
      this.logLazy(LogLevel.debug, message);
    } else {
      this.logTemplate(LogLevel.debug, message, values);
    }
  }

  info(message: TemplateStringsArray | string | LogCallback, ...values: unknown[]): void {
    if (typeof message === "string") {
      const properties = (values[0] ?? {}) as unknown as T;
      this.log(LogLevel.info, message, properties);
    } else if (typeof message === "function") {
      this.logLazy(LogLevel.info, message);
    } else {
      this.logTemplate(LogLevel.info, message, values);
    }
  }

  warn(message: TemplateStringsArray | string | LogCallback, ...values: unknown[]): void {
    if (typeof message === "string") {
      const properties = (values[0] ?? {}) as unknown as T;
      this.log(LogLevel.warn, message, properties);
    } else if (typeof message === "function") {
      this.logLazy(LogLevel.warn, message);
    } else {
      this.logTemplate(LogLevel.warn, message, values);
    }
  }

  error(message: TemplateStringsArray | string | LogCallback, ...values: unknown[]): void {
    if (typeof message === "string") {
      const properties = (values[0] ?? {}) as unknown as T;
      this.log(LogLevel.error, message, properties);
    } else if (typeof message === "function") {
      this.logLazy(LogLevel.error, message);
    } else {
      this.logTemplate(LogLevel.error, message, values);
    }
  }

  fatal(message: TemplateStringsArray | string | LogCallback, ...values: unknown[]): void {
    if (typeof message === "string") {
      const properties = (values[0] ?? {}) as unknown as T;
      this.log(LogLevel.fatal, message, properties);
    } else if (typeof message === "function") {
      this.logLazy(LogLevel.fatal, message);
    } else {
      this.logTemplate(LogLevel.fatal, message, values);
    }
  }

  onLog(callback: (event: LogLevel, record: LogRecord) => void): {
    subscription: LogSubscription;
  } {
    // 고유한 ID를 생성합니다.
    const id: string = createLoggerId();
    const subscription: LogSubscription = {
      id,
      callback,
      unsubscribe: () => {
        this.stateChangeEmitters.delete(id);
      },
    };

    // 세션 변경 콜백 함수를 저장합니다.
    this.stateChangeEmitters.set(id, subscription);

    return { subscription };
  }

  /**
   * all subscribers of the logger instance are notified of the event
   *
   * @param event - The event to notify subscribers of {@link LogLevel}
   * @param record - The log record to notify subscribers of {@link LogRecord}
   *
   */
  private notifyAllSubscribers(event: LogLevel, record: LogRecord) {
    // stateChangeEmitters에 등록된 Map의 값을 가져옵니다.
    const emitters = Array.from(this.stateChangeEmitters.values());

    for (const emitter of emitters) {
      emitter.callback(event, record);
    }
  }

  /**
   * Sends a log record to the transport.
   *
   * @param record - The log record to send. {@link LogRecord}
   *
   */
  private emit(record: LogRecord): void {
    if (this.lowestLevel === null || compareLogLevel(record.level, this.lowestLevel) < 0) {
      return;
    }

    const transports = this.transport.toArray();

    transports.filter((transport) => transport.enabled).map((transport) => transport.send(record));
  }
}
