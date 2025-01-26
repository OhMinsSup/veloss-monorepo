export type RuntimeEnv = Record<string, string | boolean | number | undefined>;

export type Prefix = {
  server: string;
  client: string;
};

export type EnvOptions = {
  envFile?: string;
};

export type Env<Client extends RuntimeEnv = RuntimeEnv, Server extends RuntimeEnv = RuntimeEnv> = {
  public: Client;
  private: Server;
};

export type SupportType = "string" | "number" | "boolean" | "object" | "array";

export type Recordable<K extends string = string, T = unknown> = Record<K, T>;
