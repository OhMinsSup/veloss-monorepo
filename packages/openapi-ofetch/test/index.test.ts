import { listen, type Listener } from "listhen";
import { getQuery, joinURL } from "ufo";
import { createApp, createError, eventHandler, readBody, readRawBody, toNodeListener } from "h3";
import { describe, beforeEach, beforeAll, afterAll, it, expect, vi } from "vitest";
import { createOpenApiFetch } from "../src";
import type { FetchError } from "../src/error";

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
    const $fetch = createOpenApiFetch({
      base: listener.url,
    });

    const response = await $fetch({
      method: "get",
      path: "/ok",
    });

    const data = response?.data;

    expect(data).toEqual({ ok: true });
  });

  it("baseURL", async () => {
    const $fetch = createOpenApiFetch({
      base: listener.url,
    });
    const response = await $fetch(
      {
        method: "get",
        path: "/url",
      },
      {
        parseAs: "text",
        params: {
          query: {
            foo: 123,
          },
        },
      },
    );

    expect(response?.data).to.equal("?foo=123");
  });

  it("post", async () => {
    const $fetch = createOpenApiFetch({
      base: listener.url,
    });

    const response = await $fetch(
      {
        method: "post",
        path: "/post",
      },
      {
        body: {
          foo: "bar",
        },
      },
    );

    expect(response?.data.body).to.deep.equal({ foo: "bar" });

    const response2 = await $fetch(
      {
        method: "post",
        path: "/post",
      },
      {
        method: "POST",
        body: { num: 42 },
        headers: {
          "x-header": "1",
          accept: "application/json",
        },
      },
    );
    const headers = response2?.data.headers;
    expect(headers).to.include({ "x-header": "1" });
    expect(headers).to.include({ accept: "application/json" });
  });

  it("does not stringify body when content type != application/json", async () => {
    const $fetch = createOpenApiFetch({
      base: listener.url,
    });

    const message = "Hallo von Pascal";
    const response = await $fetch(
      {
        method: "post",
        path: "/post",
      },
      {
        body: message,
        headers: {
          "Content-Type": "text/plain",
        },
      },
    );

    const body = response?.data.body;
    const replace = body.replace(/\\\"/g, '"').replace(/\"/g, "");
    expect(replace).to.equal(message);
  });

  it("Handle Buffer body", async () => {
    const $fetch = createOpenApiFetch({
      base: listener.url,
    });

    const message = "Hallo von Pascal";
    const response = await $fetch(
      {
        method: "post",
        path: "/post",
      },
      {
        body: Buffer.from("Hallo von Pascal"),
        headers: {
          "Content-Type": "text/plain",
        },
      },
    );

    const body = response?.data.body;
    const json = JSON.parse(body);
    const buffer = Buffer.from(json.data).toString("utf-8");
    expect(buffer).to.equal(message);
  });

  it("404", async () => {
    const $fetch = createOpenApiFetch({
      base: listener.url,
    });

    const error: Awaited<FetchError<any>> = await $fetch({
      method: "get",
      path: "/404",
    }).catch((_error) => _error);

    const { data, statusMessage, statusCode } = error.toJSON();

    expect(statusMessage).to.contain("Cannot find any path matching /404.");
    expect(statusCode).to.equal(404);
    expect(data?.response?.data).toBeUndefined();
    expect(data?.response?.error).to.deep.eq({
      stack: [],
      statusCode: 404,
      statusMessage: "Cannot find any path matching /404.",
    });
    expect(data?.response?.response.url).to.equal(getURL("404"));
  });

  it("403 with ignoreResponseError", async () => {
    const $fetch = createOpenApiFetch({
      base: listener.url,
    });

    const error: Awaited<FetchError<any>> = await $fetch({
      method: "get",
      path: "/403",
    }).catch((_error) => _error);

    const { data, statusMessage, statusCode } = error.toJSON();

    expect(statusMessage).to.contain("Forbidden");
    expect(statusCode).to.equal(403);
  });

  it("204 no content", async () => {
    const $fetch = createOpenApiFetch({
      base: listener.url,
    });

    const response = await $fetch({
      method: "get",
      path: "/204",
    });

    expect(response?.data).toBeUndefined();
  });

  it("base with retry", async () => {
    const $fetch = createOpenApiFetch({
      base: listener.url,
    });

    const error: Awaited<FetchError<any>> = await $fetch(
      {
        method: "get",
        path: "/404",
      },
      {
        retry: 2,
      },
    ).catch((_error) => _error);

    const { data } = error.toJSON();

    expect(data?.response?.response.url).to.equal(getURL("404"));
  });

  it("retry with number delay", async () => {
    const $fetch = createOpenApiFetch({
      base: listener.url,
    });

    const slow = $fetch(
      {
        method: "get",
        path: "/408",
      },
      {
        retry: 2,
        retryDelay: 100,
      },
    ).catch(() => "slow");

    const fast = $fetch(
      {
        method: "get",
        path: "/408",
      },
      {
        retry: 2,
        retryDelay: 1,
      },
    ).catch(() => "fast");

    const race = await Promise.race([slow, fast]);

    expect(race).to.equal("fast");
  });

  it("retry with callback delay", async () => {
    const $fetch = createOpenApiFetch({
      base: listener.url,
    });

    const slow = $fetch(
      {
        method: "get",
        path: "/408",
      },
      {
        retry: 2,
        retryDelay: () => 100,
      },
    ).catch(() => "slow");

    const fast = $fetch(
      {
        method: "get",
        path: "/408",
      },
      {
        retry: 2,
        retryDelay: () => 1,
      },
    ).catch(() => "fast");

    const race = await Promise.race([slow, fast]);

    expect(race).to.equal("fast");
  });

  it("passing request obj should return request obj in error", async () => {
    const $fetch = createOpenApiFetch({
      base: listener.url,
    });
    const error: Awaited<FetchError<any>> = await $fetch({
      method: "post",
      path: "/403",
    }).catch((_error) => _error);

    const { data, statusMessage, statusCode } = error.toJSON();

    expect(statusMessage).to.contain("Forbidden");
    expect(statusCode).to.equal(403);
    expect(data?.response?.response.url).to.equal(getURL("403"));
    expect(data?.request?.method).to.equal("post");
  });

  it("aborting on timeout", async () => {
    const $fetch = createOpenApiFetch({
      base: listener.url,
    });
    const noTimeout = $fetch({
      method: "get",
      path: "/timeout",
    }).catch(() => "no timeout");

    const timeout = $fetch(
      {
        method: "get",
        path: "/timeout",
      },
      {
        timeout: 100,
        retry: 0,
      },
    ).catch(() => "timeout");

    const race = await Promise.race([noTimeout, timeout]);
    expect(race).to.equal("timeout");
  });

  it("aborting on timeout reason", async () => {
    const $fetch = createOpenApiFetch({
      base: listener.url,
    });
    await $fetch(
      {
        method: "get",
        path: "/timeout",
      },
      {
        timeout: 100,
        retry: 0,
      },
    ).catch((error) => {
      expect(error.cause.message).to.include("The operation was aborted due to timeout");
      expect(error.cause.name).to.equal("TimeoutError");
      expect(error.cause.code).to.equal(DOMException.TIMEOUT_ERR);
    });
  });

  it("shouldThrowOnError", async () => {
    const $fetch = createOpenApiFetch({
      base: listener.url,
    });

    const response = await $fetch(
      {
        method: "get",
        path: "/404",
      },
      {
        shouldThrowOnError: false,
      },
    );

    const data = response?.data;
    const error = response?.error;

    expect(data).toBeUndefined();
    expect(error.statusMessage).to.contain("Cannot find any path matching /404.");
    expect(error).to.deep.eq({
      stack: [],
      statusCode: 404,
      statusMessage: "Cannot find any path matching /404.",
    });
    expect(response?.response.url).to.equal(getURL("404"));
  });

  it("fetch middleware errors", async () => {
    const $fetch = createOpenApiFetch({
      base: listener.url,
    });

    // onFetchRequest
    await expect(
      $fetch(
        {
          method: "get",
          path: "/ok",
        },
        {
          onFetchRequest: () => {
            throw new Error("error in onFetchRequest");
          },
        },
      ),
    ).rejects.toThrow("error in onFetchRequest");

    // onFetchError
    await expect(
      $fetch(
        {
          method: "get",
          path: "/403",
        },
        {
          onFetchError: () => {
            throw new Error("error in onFetchError");
          },
        },
      ),
    ).rejects.toThrow("error in onFetchError");

    // onFetchResponse
    await expect(
      $fetch(
        {
          method: "get",
          path: "/ok",
        },
        {
          onFetchResponse: () => {
            throw new Error("error in onFetchResponse");
          },
        },
      ),
    ).rejects.toThrow("error in onFetchResponse");
  });

  it("calls middlewares", async () => {
    const $fetch = createOpenApiFetch({
      base: listener.url,
    });

    const onFetchRequest = vi.fn();
    const onFetchError = vi.fn();
    const onFetchResponse = vi.fn();

    await $fetch(
      {
        method: "get",
        path: "/ok",
      },
      {
        onFetchRequest,
        onFetchResponse,
        onFetchError,
      },
    );

    expect(onFetchRequest).toHaveBeenCalledOnce();
    expect(onFetchError).not.toHaveBeenCalled();
    expect(onFetchResponse).toHaveBeenCalledOnce();

    onFetchRequest.mockReset();
    onFetchResponse.mockReset();
    onFetchError.mockReset();

    await $fetch(
      {
        method: "get",
        path: "/403",
      },
      {
        onFetchRequest,
        onFetchResponse,
        onFetchError,
      },
    ).catch((error) => error);

    expect(onFetchRequest).toHaveBeenCalledOnce();
    expect(onFetchError).toHaveBeenCalledOnce();
    expect(onFetchResponse).not.toHaveBeenCalled();

    onFetchRequest.mockReset();
    onFetchResponse.mockReset();
    onFetchError.mockReset();

    await $fetch(
      {
        method: "get",
        path: "/ok",
      },
      {
        onFetchRequest: [onFetchRequest, onFetchRequest],
        onFetchResponse: [onFetchResponse, onFetchResponse],
        onFetchError: [onFetchError, onFetchError],
      },
    );

    expect(onFetchRequest).toHaveBeenCalledTimes(2);
    expect(onFetchError).not.toHaveBeenCalled();
    expect(onFetchResponse).toHaveBeenCalledTimes(2);

    onFetchRequest.mockReset();
    onFetchResponse.mockReset();
    onFetchError.mockReset();

    await $fetch(
      {
        method: "get",
        path: "/403",
      },
      {
        onFetchRequest: [onFetchRequest, onFetchRequest],
        onFetchResponse: [onFetchResponse, onFetchResponse],
        onFetchError: [onFetchError, onFetchError],
      },
    ).catch((error) => error);

    expect(onFetchRequest).toHaveBeenCalledTimes(2);
    expect(onFetchResponse).not.toHaveBeenCalled();
    expect(onFetchError).toHaveBeenCalledTimes(2);
  });
});
