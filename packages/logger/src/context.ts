import type { LogContext } from "./types";

/**
 * Create a context manager to manage context for a logger.
 *
 * ```ts
 * const contextManager = createContextManager();
 * ```
 *
 * @returns A context manager.
 */
export function createContextManager<T extends Record<string, any>>() {
  /**
   * A context is a map of key-value pairs.
   */
  const contexts = new Map<number, LogContext<T>>();

  /**
   * The current context id.
   * This is used to get the current context from the context map.
   */
  let currentId = 0;

  /**
   * Get the current context id.
   * This is used to get the current context from the context map.
   *
   * ```ts
   * const contextId = getContextId();
   * ```
   *
   * @returns The current context id.
   */
  function getContextId(): number {
    return currentId;
  }

  /**
   * Run a callback with a given context.
   * The context will be available within the callback.
   *
   * @param context The context to run the callback with.
   * @param callback The callback to run.
   *
   * ```ts
   * contextManager.runWithContext(new Map(), () => {
   *  contextManager.set("key", "value");
   *  contextManager.get("key"); // "value"
   * });
   * ```
   */
  function runWithContext(context: LogContext<T>, callback: () => void) {
    const contextId = ++currentId;
    contexts.set(contextId, context);
    try {
      callback();
    } finally {
      contexts.delete(contextId);
    }
  }

  /**
   * Get a value from the current context.
   *
   * @param key The key to get the value for.
   *
   * ```ts
   * const value = contextManager.get("key"); // "value" | undefined
   * ```
   *  @returns The value for the key. If the key does not exist, it will return `undefined`.
   */
  function get<K extends keyof T>(key: K): T[K] | undefined {
    const context = contexts.get(getContextId());
    return context ? context.get(key) : undefined;
  }

  /**
   * Get the current context.
   * If the context does not exist, it will return `undefined`.
   *
   * ```ts
   * const context = contextManager.getStore();
   * ```
   *
   * @returns The current context. If the context does not exist, it will return `undefined`.
   */
  function getStore(): LogContext<T> | undefined {
    return contexts.get(getContextId());
  }

  /**
   * Set a key-value pair in the current context.
   *
   * @param key The key to set the value for.
   * @param value The value to set.
   *
   * ```ts
   * contextManager.set("key", "value");
   * ```
   */
  function set<K extends keyof T>(key: K, value: T[K]): void {
    const context = contexts.get(getContextId());
    if (context) {
      context.set(key, value);
    }
  }

  /**
   * Create an empty context.
   * This is useful when you want to create a new context.
   *
   * ```ts
   * const context = contextManager.createEmptyContext();
   * ```
   *
   * @returns An empty context.
   */
  function createEmptyContext(): LogContext<T> {
    return new Map<T[keyof T], T[keyof T]>();
  }

  /**
   * Get all contexts.
   * This is useful when you want to get all contexts.
   *
   * ```ts
   * const context = contextManager.getContext();
   * ```
   *
   * @returns All contexts.
   */
  function getContext(): Map<number, LogContext<T>> {
    return contexts;
  }

  return {
    runWithContext,
    createEmptyContext,
    get,
    getStore,
    getContext,
    set,
  };
}

export type ContextManager<T extends Record<string, any>> = ReturnType<typeof createContextManager<T>>;
