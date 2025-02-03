import { describe, beforeEach, beforeAll, afterAll, it, expect, vi } from "vitest";
import { Logger } from "../src";
import { ConsoleTransport } from "../src/transports/console";

describe("logger", () => {
  it("ok", async () => {
    const logger = new Logger({
      category: ["root"],
      transports: [new ConsoleTransport()],
    });

    const childLogger = new Logger({
      category: ["child"],
      parent: logger,
      transports: [new ConsoleTransport()],
    });

    logger.info("Hello, world!");

    childLogger.info("Hello, world!!!!! child");

    expect({ ok: true }).toEqual({ ok: true });
  });
});
