import type { LogRecord } from "../types";
import { LoggerTransport } from "../transport";
import { LogLevel, shortLogLevel } from "../level";

interface ConsoleTransportConstructor {
  id: string;
  enabled: boolean;
  logger: Console;
}

export class ConsoleTransport extends LoggerTransport<Console, unknown> {
  private logLevelStyles: Record<LogLevel, string> = {
    [LogLevel.debug]: "background-color: gray; color: white;",
    [LogLevel.info]: "background-color: white; color: black;",
    [LogLevel.warn]: "background-color: orange; color: black;",
    [LogLevel.error]: "background-color: red; color: white;",
    [LogLevel.fatal]: "background-color: maroon; color: white;",
    [LogLevel.trace]: "background-color: gray; color: white;",
  };

  constructor(config: ConsoleTransportConstructor = { id: "console", enabled: true, logger: console }) {
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
    let msg = "";
    const values: unknown[] = [];
    for (let i = 0; i < record.message.length; i++) {
      if (i % 2 === 0) {
        msg += record.message[i];
      } else {
        msg += "%o";
        values.push(record.message[i]);
      }
    }
    const date = new Date(record.timestamp);
    const time = `${date.getUTCHours().toString().padStart(2, "0")}:${date
      .getUTCMinutes()
      .toString()
      .padStart(2, "0")}:${date.getUTCSeconds().toString().padStart(2, "0")}.${date
      .getUTCMilliseconds()
      .toString()
      .padStart(3, "0")}`;

    return [
      `%c${time} ${record.prefix} %c${shortLogLevel(record.level)}%c %c${record.category.join("\xb7")} %c${msg}`,
      "color: gray;",
      this.logLevelStyles[record.level],
      "background-color: default;",
      "color: gray;",
      "color: default;",
      ...values,
    ];
  }
}
