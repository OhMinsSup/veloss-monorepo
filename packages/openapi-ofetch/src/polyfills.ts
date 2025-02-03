type GlobalThis = typeof globalThis;

declare global {
  interface Object {
    /**
     * `globalThis` polyfill for Node.js and browser.
     */
    __magic_global_fetch__: GlobalThis;
  }
}

/**
 * `globalThis` polyfill for Node.js and browser.
 *  {@link https://mathiasbynens.be/notes/globalthis}
 */
export function polyfillGlobalThis() {
  if (typeof globalThis === "object") {
    return;
  }

  try {
    Object.defineProperty(Object.prototype, "__magic_global_fetch__", {
      get: function () {
        return this as GlobalThis;
      },
      configurable: true,
    });

    // @ts-expect-error 'Allow access to __magic_global_fetch__'
    __magic_global_fetch__.globalThis = __magic_global_fetch__;

    // @ts-expect-error 'Allow access to __magic_global_fetch__'
    Object.prototype.__magic_global_fetch__ = undefined;
  } catch {
    if (typeof self !== "undefined") {
      // @ts-expect-error 'Allow access to globals'
      self.globalThis = self;
    }
  }
}
