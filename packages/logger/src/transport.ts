import { createLoggerId } from "./id";
import type { LogRecord } from "./types";

export interface TransportConstructor<LogLibrary, Formatter>
  extends Pick<LoggerTransport<LogLibrary, Formatter>, "id" | "enabled"> {
  logger: LogLibrary;
}

export abstract class LoggerTransport<LogLibrary, Formatter> {
  /**
   * An identifier for the transport. If not defined, a cuid will be generated.
   */
  id?: string;

  /**
   * Instance of the logger library
   */
  protected logger: LogLibrary;

  /**
   * If false, the transport will not send logs to the logger.
   */
  enabled: boolean;

  constructor(config: TransportConstructor<LogLibrary, Formatter>) {
    this.id = createLoggerId(config.id);
    this.logger = config.logger;
    this.enabled = config.enabled ?? true;
  }

  /**
   * Returns the logger instance attached to the transport
   *
   * @returns The logger instance
   */
  getLogger(): LogLibrary {
    return this.logger;
  }

  /**
   * Send a log record to the transport.
   *
   * @param record - The log record to send. {@link LogRecord}
   */
  abstract send(record: LogRecord): void;

  /**
   * Format a log record into a list of formatters.
   *
   * @param record - The log record to format. {@link LogRecord}
   *
   * @returns The list of formatters.
   */
  abstract formatter(record: LogRecord): readonly Formatter[];
}
