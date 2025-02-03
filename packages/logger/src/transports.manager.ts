import { createLoggerId } from "./id";
import type { LoggerTransport } from "./transport";

export interface LoggerTransportManagerConstructor<LoggerLibrary = any, Formatter = any> {
  transports?: LoggerTransport<LoggerLibrary, Formatter>[] | LoggerTransport<LoggerLibrary, Formatter>;
}

export class LoggerTransportManager<LoggerLibrary = any, Formatter = any> {
  /**
   * A map of transports. The key is the transport id.
   * The value is the transport instance.
   */
  protected context: Map<string, LoggerTransport<LoggerLibrary, Formatter>> = new Map<
    string,
    LoggerTransport<LoggerLibrary, Formatter>
  >();

  constructor(params: LoggerTransportManagerConstructor) {
    this.context = this.init(params.transports);
  }

  /**
   * Initialize the transport manager with a list of transports.
   *
   * @param transports - a list of transports or a single transport. If a single transport is provided, it will be converted to a list.
   *
   * ```ts
   * const manager = new LoggerTransportManager();
   * manager.init({ transports: [new ConsoleTransport()] });
   *
   * =>
   * Map {
   *  'console' => ConsoleTransport { id: 'console', logger: console, enabled: true } (ConsoleTransport)
   * }
   * ```
   */
  private init(
    transports: LoggerTransport<LoggerLibrary, Formatter> | LoggerTransport<LoggerLibrary, Formatter>[] = [],
  ): Map<string, LoggerTransport<LoggerLibrary, Formatter>> {
    const map = new Map<string, LoggerTransport<LoggerLibrary, Formatter>>();

    const isArray = Array.isArray(transports);
    if (isArray) {
      for (const transport of transports) {
        const id = createLoggerId(transport.id);
        map.set(id, transport);
      }
    } else {
      const id = createLoggerId(transports.id);
      map.set(id, transports);
    }

    return map;
  }

  /**
   * Returns a list of transports.
   * ```ts
   * const manager = new LoggerTransportManager();
   * manager.init({ transports: [new ConsoleTransport()] });
   * manager.toArray();
   * =>
   * [ ConsoleTransport { id: 'console', logger: console, enabled: true } ]
   * ```
   */
  toArray(): LoggerTransport<LoggerLibrary, Formatter>[] {
    return Array.from(this.context.values());
  }

  /**
   * Returns a transport by id.
   *
   * @param id - The transport id.
   *
   * ```ts
   * const manager = new LoggerTransportManager();
   * manager.init({ transports: [new ConsoleTransport()] });
   * manager.getTransport('console');
   * ```
   */
  removeTransport(id: string): void {
    this.context.delete(id);
  }

  /**
   * Add a transport or a list of transports.
   *
   * @param transports - a list of transports or a single transport. If a single transport is provided, it will be converted to a list.
   *
   * ```ts
   * const manager = new LoggerTransportManager();
   * manager.addTransport(new ConsoleTransport());
   * // or
   * manager.addTransport([new ConsoleTransport(), new FileTransport()]);
   * ```
   */
  addTransport(
    transport: LoggerTransport<LoggerLibrary, Formatter> | LoggerTransport<LoggerLibrary, Formatter>[],
  ): void {
    const added = this.init(transport);
    const unique = new Map([...this.context, ...added]);
    this.context = unique;
  }

  /**
   * Enable a transport by id.
   *
   * @param id - The transport id.
   *
   * ```ts
   * const manager = new LoggerTransportManager();
   * manager.init({ transports: [new ConsoleTransport()] });
   * manager.enableTransport('console');
   * ```
   */
  enableTransport(id: string): void {
    const transport = this.context.get(id);
    if (transport) {
      transport.enabled = true;
    }
  }

  /**
   * Disable a transport by id.
   *
   * @param id - The transport id.
   *
   * ```ts
   * const manager = new LoggerTransportManager();
   * manager.init({ transports: [new ConsoleTransport()] });
   * manager.disableTransport('console');
   * ```
   */
  disableTransport(id: string): void {
    const transport = this.context.get(id);
    if (transport) {
      transport.enabled = false;
    }
  }

  /**
   * Enable all transports.
   *
   * ```ts
   * const manager = new LoggerTransportManager();
   * manager.init({ transports: [new ConsoleTransport()] });
   * manager.enableAllTransports();
   * ```
   */
  enableAllTransports(): void {
    for (const transport of this.context.values()) {
      transport.enabled = true;
    }
  }

  /**
   * Disable all transports.
   *
   * ```ts
   * const manager = new LoggerTransportManager();
   * manager.init({ transports: [new ConsoleTransport()] });
   * manager.disableAllTransports();
   * ```
   */
  disableAllTransports(): void {
    for (const transport of this.context.values()) {
      transport.enabled = false;
    }
  }

  /**
   * Release all transports.
   *
   * ```ts
   * const manager = new LoggerTransportManager();
   * manager.init({ transports: [new ConsoleTransport()] });
   * manager.release();
   * ```
   */
  release(): void {
    this.context.clear();
  }
}
