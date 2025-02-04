/**
 * The log level.
 */
export enum LogLevel {
  /**
   * Log level for informational messages.
   */
  info = "info",
  /**
   * Log level for warning messages.
   */
  warn = "warn",
  /**
   * Log level for error messages.
   */
  error = "error",
  /**
   * Log level for debug messages
   */
  debug = "debug",
  /**
   * Log level for trace messages
   */
  trace = "trace",
  /**
   * Log level for fatal messages
   */
  fatal = "fatal",
}

/**
 * array of log levels
 */
export const logLevels: LogLevel[] = [LogLevel.debug, LogLevel.info, LogLevel.warn, LogLevel.error, LogLevel.fatal];

/**
 * compare log levels
 * @param a log level a {@link LogLevel}
 * @param b log level b {@link LogLevel}
 *
 * @example
 * ```ts
 * compareLogLevel(LogLevel.debug, LogLevel.info); // -1
 * compareLogLevel(LogLevel.info, LogLevel.debug); // 1
 * compareLogLevel(LogLevel.info, LogLevel.info); // 0
 * ```
 *
 * @throws TypeError if a or b is not a valid log level
 *
 * @returns number
 */
export function compareLogLevel(a: LogLevel, b: LogLevel): number {
  const aIndex = logLevels.indexOf(a);
  if (aIndex < 0) {
    throw new TypeError(`Invalid log level: ${JSON.stringify(a)}.`);
  }
  const bIndex = logLevels.indexOf(b);
  if (bIndex < 0) {
    throw new TypeError(`Invalid log level: ${JSON.stringify(b)}.`);
  }
  return aIndex - bIndex;
}

/**
 * check if the level is a log level
 * @param level log level {@link LogLevel}
 *
 * @example
 * ```ts
 * isLogLevel(LogLevel.debug); // true
 * isLogLevel("info"); // false
 * ```
 *
 * @returns boolean
 */
export function isLogLevel(level: LogLevel): level is LogLevel {
  switch (level) {
    case LogLevel.debug:
    case LogLevel.info:
    case LogLevel.warn:
    case LogLevel.error:
    case LogLevel.fatal:
      return true;
    default:
      return false;
  }
}

/**
 * get the short log level
 *
 * @param level log level {@link LogLevel}
 *
 * @example
 * ```ts
 * shortLogLevel(LogLevel.debug); // "DBG"
 * shortLogLevel(LogLevel.info); // "INF"
 * shortLogLevel(LogLevel.warn); // "WRN"
 * shortLogLevel(LogLevel.error); // "ERR"
 * shortLogLevel(LogLevel.fatal); // "FTL"
 * ```
 *
 * @returns string
 */
export function shortLogLevel(level: LogLevel): string {
  switch (level) {
    case LogLevel.debug:
      return "DBG";
    case LogLevel.info:
      return "INF";
    case LogLevel.warn:
      return "WRN";
    case LogLevel.error:
      return "ERR";
    case LogLevel.fatal:
      return "FTL";
    default:
      return level.toUpperCase();
  }
}
