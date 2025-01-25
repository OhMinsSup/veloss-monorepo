import { listen, type Listener } from "listhen";
import { getQuery, joinURL } from "ufo";
import { createApp, createError, eventHandler, readBody, readRawBody, toNodeListener } from "h3";
import { describe, beforeEach, beforeAll, afterAll, it, expect, vi } from "vitest";
import { createOpenApiBuilder } from "../src";
import { FetchError, isFetchError } from "@veloss/openapi-ofetch";

describe("openapi-builder", () => {
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

  it("baseURL", async () => {
    const client = createOpenApiBuilder({
      base: listener.url,
    });

    const response = await client
      .method("get")
      .path("/url")
      .setParseAs("text")
      .setParams({
        query: {
          foo: 123,
        },
      })
      .fetch();

    expect(response?.data).to.equal("?foo=123");
  });

  it("post", async () => {
    const client = createOpenApiBuilder({
      base: listener.url,
    });

    const response = await client.method("post").path("/post").setBody({ foo: "bar" }).fetch();

    expect(response?.data.body).to.deep.equal({ foo: "bar" });

    const response2 = await client
      .method("post")
      .path("/post")
      .setHeaders({
        "x-header": "1",
        accept: "application/json",
      })
      .setBody({ num: 42 })
      .fetch();

    const headers = response2?.data.headers;
    expect(headers).to.include({ "x-header": "1" });
    expect(headers).to.include({ accept: "application/json" });
  });

  it("does not stringify body when content type != application/json", async () => {
    const client = createOpenApiBuilder({
      base: listener.url,
    });

    const message = "Hallo von Pascal";
    const response = await client
      .method("post")
      .path("/post")
      .setHeaders({
        "Content-Type": "text/plain",
      })
      .setBody(message)
      .fetch();

    const body = response?.data.body;
    const replace = body.replace(/\\\"/g, '"').replace(/\"/g, "");
    expect(replace).to.equal(message);
  });

  it("Handle Buffer body", async () => {
    const client = createOpenApiBuilder({
      base: listener.url,
    });
    const message = "Hallo von Pascal";
    const response = await client
      .method("post")
      .path("/post")
      .setHeaders({
        "Content-Type": "text/plain",
      })
      .setBody(Buffer.from(message))
      .fetch();

    const body = response?.data.body;
    const json = JSON.parse(body);
    const buffer = Buffer.from(json.data).toString("utf-8");
    expect(buffer).to.equal(message);
  });

  it("404", async () => {
    const client = createOpenApiBuilder({
      base: listener.url,
    });

    let error: FetchError<any> | undefined;

    try {
      await client.method("get").path("/404").fetch();
    } catch (e) {
      error = e as FetchError<any>;
    }

    expect(error).to.be.instanceOf(FetchError);

    if (error instanceof FetchError) {
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
    }
  });

  it("403 with ignoreResponseError", async () => {
    const client = createOpenApiBuilder({
      base: listener.url,
    });

    let error: FetchError<any> | undefined;

    try {
      await client.method("get").path("/403").fetch();
    } catch (e) {
      error = e as FetchError<any>;
    }

    expect(error).to.be.instanceOf(FetchError);

    if (error instanceof FetchError) {
      const { statusMessage, statusCode } = error.toJSON();
      expect(statusMessage).to.contain("Forbidden");
      expect(statusCode).to.equal(403);
    }
  });

  it("204 no content", async () => {
    const client = createOpenApiBuilder({
      base: listener.url,
    });

    const response = await client.method("get").path("/204").fetch();

    expect(response?.data).toBeUndefined();
  });

  it("base with retry", async () => {
    const client = createOpenApiBuilder({
      base: listener.url,
    });

    let error: FetchError<any> | undefined;

    try {
      await client
        .method("get")
        .path("/404")
        .setRetry({
          retry: 2,
        })
        .fetch();
    } catch (e) {
      error = e as FetchError<any>;
    }

    expect(error).to.be.instanceOf(FetchError);

    if (error instanceof FetchError) {
      const { data } = error.toJSON();

      expect(data?.response?.response.url).to.equal(getURL("404"));
    }
  });

  it("retry with number delay", async () => {
    const client = createOpenApiBuilder({
      base: listener.url,
    });

    const slow = async () => {
      try {
        await client
          .method("get")
          .path("/408")
          .setRetry({
            retry: 2,
            retryDelay: 100,
          })
          .fetch();
      } catch {
        return "slow";
      }
    };

    const fast = async () => {
      try {
        await client
          .method("get")
          .path("/408")
          .setRetry({
            retry: 2,
            retryDelay: 1,
          })
          .fetch();
      } catch {
        return "fast";
      }
    };

    const race = await Promise.race([slow(), fast()]);

    expect(race).to.equal("fast");
  });

  it("retry with callback delay", async () => {
    const client = createOpenApiBuilder({
      base: listener.url,
    });

    const slow = async () => {
      try {
        await client
          .method("get")
          .path("/408")
          .setRetry({
            retry: 2,
            retryDelay: () => 100,
          })
          .fetch();
      } catch {
        return "slow";
      }
    };

    const fast = async () => {
      try {
        await client
          .method("get")
          .path("/408")
          .setRetry({
            retry: 2,
            retryDelay: () => 1,
          })
          .fetch();
      } catch {
        return "fast";
      }
    };

    const race = await Promise.race([slow(), fast()]);

    expect(race).to.equal("fast");
  });

  it("passing request obj should return request obj in error", async () => {
    const client = createOpenApiBuilder({
      base: listener.url,
    });

    let error: FetchError<any> | undefined;

    try {
      await client.method("post").path("/403").fetch();
    } catch (e) {
      error = e as FetchError<any>;
    }

    expect(error).to.be.instanceOf(FetchError);

    if (error instanceof FetchError) {
      const { data, statusMessage, statusCode } = error.toJSON();

      expect(statusMessage).to.contain("Forbidden");
      expect(statusCode).to.equal(403);
      expect(data?.response?.response.url).to.equal(getURL("403"));
      expect(data?.request?.method).to.equal("post");
    }
  });

  it("aborting on timeout", async () => {
    const client = createOpenApiBuilder({
      base: listener.url,
    });

    const noTimeout = async () => {
      try {
        await client.method("get").path("/timeout").fetch();
      } catch (error) {
        return "no timeout";
      }
    };

    const timeout = async () => {
      try {
        await client
          .method("get")
          .path("/timeout")
          .setRetry({
            retry: 0,
          })
          .setTimeout(100)
          .fetch();
      } catch (error) {
        return "timeout";
      }
    };

    const race = await Promise.race([noTimeout(), timeout()]);
    expect(race).to.equal("timeout");
  });

  it("aborting on timeout reason", async () => {
    const client = createOpenApiBuilder({
      base: listener.url,
    });

    try {
      await client.method("get").path("/timeout").setRetry({ retry: 0 }).setTimeout(100).fetch();
    } catch (e) {
      if (isFetchError<any>(e)) {
        const cause = e.cause as FetchError<any>;
        expect(cause.message).to.include("The operation was aborted due to timeout");
        expect(cause.name).to.equal("TimeoutError");
        expect(cause.code).to.equal(DOMException.TIMEOUT_ERR);
      }
    }
  });

  it("shouldThrowOnError", async () => {
    const client = createOpenApiBuilder({
      base: listener.url,
    });

    const response = await client.method("get").path("/404").setShouldThrowOnError(false).fetch();

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
    const client = createOpenApiBuilder({
      base: listener.url,
    });

    // onFetchRequest
    await expect(
      client
        .method("get")
        .path("/ok")
        .setMiddleware({
          onFetchRequest: () => {
            throw new Error("error in onFetchRequest");
          },
        })
        .fetch(),
    ).rejects.toThrow("error in onFetchRequest");

    // onFetchError
    await expect(
      client
        .method("get")
        .path("/403")
        .setMiddleware({
          onFetchError: () => {
            throw new Error("error in onFetchError");
          },
        })
        .fetch(),
    ).rejects.toThrow("error in onFetchError");

    // onFetchResponse
    await expect(
      client
        .method("get")
        .path("/ok")
        .setMiddleware({
          onFetchResponse: () => {
            throw new Error("error in onFetchResponse");
          },
        })
        .fetch(),
    ).rejects.toThrow("error in onFetchResponse");
  });

  it("calls middlewares", async () => {
    const client = createOpenApiBuilder({
      base: listener.url,
    });

    const onFetchRequest = vi.fn();
    const onFetchError = vi.fn();
    const onFetchResponse = vi.fn();

    await client.method("get").path("/ok").setMiddleware({ onFetchRequest, onFetchResponse, onFetchError }).fetch();

    expect(onFetchRequest).toHaveBeenCalledOnce();
    expect(onFetchError).not.toHaveBeenCalled();
    expect(onFetchResponse).toHaveBeenCalledOnce();

    onFetchRequest.mockReset();
    onFetchResponse.mockReset();
    onFetchError.mockReset();

    try {
      await client.method("get").path("/403").setMiddleware({ onFetchRequest, onFetchResponse, onFetchError }).fetch();
    } catch {
      // ignore
    }

    expect(onFetchRequest).toHaveBeenCalledOnce();
    expect(onFetchError).toHaveBeenCalledOnce();
    expect(onFetchResponse).not.toHaveBeenCalled();

    onFetchRequest.mockReset();
    onFetchResponse.mockReset();
    onFetchError.mockReset();

    await client
      .method("get")
      .path("/ok")
      .setMiddleware({
        onFetchRequest: [onFetchRequest, onFetchRequest],
        onFetchResponse: [onFetchResponse, onFetchResponse],
        onFetchError: [onFetchError, onFetchError],
      })
      .fetch();

    expect(onFetchRequest).toHaveBeenCalledTimes(2);
    expect(onFetchError).not.toHaveBeenCalled();
    expect(onFetchResponse).toHaveBeenCalledTimes(2);

    onFetchRequest.mockReset();
    onFetchResponse.mockReset();
    onFetchError.mockReset();

    try {
      await client
        .method("get")
        .path("/403")
        .setMiddleware({
          onFetchRequest: [onFetchRequest, onFetchRequest],
          onFetchResponse: [onFetchResponse, onFetchResponse],
          onFetchError: [onFetchError, onFetchError],
        })
        .fetch();
    } catch {
      // ignore
    }

    expect(onFetchRequest).toHaveBeenCalledTimes(2);
    expect(onFetchResponse).not.toHaveBeenCalled();
    expect(onFetchError).toHaveBeenCalledTimes(2);
  });
});
