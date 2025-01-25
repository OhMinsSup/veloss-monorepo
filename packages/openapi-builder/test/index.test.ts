import { listen, type Listener } from "listhen";
import { getQuery, joinURL } from "ufo";
import { createApp, createError, eventHandler, readBody, readRawBody, toNodeListener } from "h3";
import { describe, beforeEach, beforeAll, afterAll, it, expect, vi } from "vitest";
import { createOpenApiBuilder } from "../src";

describe("openapi-ofetch", () => {
  let listener: Listener;
  const getURL = (url: string) => joinURL(listener.url, url);

  const fetch = vi.spyOn(globalThis, "fetch");

  beforeAll(async () => {
    const app = createApp()
      .use(
        "/ok",
        eventHandler(() => {
          return {
            ok: true,
          };
        }),
      )
      .use(
        "/params",
        eventHandler((event) => getQuery(event.node.req.url || "")),
      )
      .use(
        "/url",
        eventHandler((event) => event.node.req.url),
      )
      .use(
        "/echo",
        eventHandler(async (event) => ({
          path: event.path,
          body: event.node.req.method === "POST" ? await readRawBody(event) : undefined,
          headers: event.node.req.headers,
        })),
      )
      .use(
        "/post",
        eventHandler(async (event) => ({
          body: await readBody(event),
          headers: event.node.req.headers,
        })),
      )
      .use(
        "/403",
        eventHandler(() => createError({ status: 403, statusMessage: "Forbidden" })),
      )
      .use(
        "/408",
        eventHandler(() => createError({ status: 408 })),
      )
      .use(
        "/204",
        eventHandler(() => null), // eslint-disable-line unicorn/no-null
      )
      .use(
        "/timeout",
        eventHandler(async () => {
          await new Promise((resolve) => {
            setTimeout(() => {
              resolve(createError({ status: 408 }));
            }, 1000 * 5);
          });
        }),
      );

    listener = await listen(toNodeListener(app));
  });

  afterAll(() => {
    listener.close().catch(console.error);
  });

  beforeEach(() => {
    fetch.mockClear();
  });

  it("ok", async () => {
    const client = createOpenApiBuilder({
      base: listener.url,
    });

    const response = await client.method("get").path("/ok").fetch();

    const data = response?.data;

    expect(data).toEqual({ ok: true });
  });
});
