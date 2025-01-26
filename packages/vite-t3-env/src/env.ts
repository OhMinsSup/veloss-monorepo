import path from "node:path";
import { loadEnv, normalizePath } from "vite";

import { filter_env, findWorkspaceDir, isExistsDotEnvFile } from "./utils";
import type { Prefix } from "./types";

interface GetEnvDirParams {
  resolvedRoot: string;
  viteConfigEnvDir?: string;
  userConfigEnvFile?: string;
}

export const get_env_dir = async ({ resolvedRoot, userConfigEnvFile, viteConfigEnvDir }: GetEnvDirParams) => {
  // 사용자가 정의한 envFile이 있으면 해당 파일의 디렉토리를 사용
  if (userConfigEnvFile) {
    return path.resolve(resolvedRoot, path.dirname(userConfigEnvFile));
  }

  // vite.config.ts에 envDir가 정의되어 있으면 해당 디렉토리를 사용
  if (viteConfigEnvDir) {
    return normalizePath(path.resolve(resolvedRoot, viteConfigEnvDir));
  }

  // 현재 디렉토리에 .env 파일이 존재하면 현재 디렉토리를 사용
  if (isExistsDotEnvFile(resolvedRoot)) {
    return resolvedRoot;
  }

  // .env 파일이 존재하지 않으면 workspace 디렉토리를 찾아서 사용
  const workspaceDir = await findWorkspaceDir(resolvedRoot);
  if (workspaceDir && isExistsDotEnvFile(workspaceDir)) {
    return workspaceDir;
  }

  throw new Error(`The .env file does not exist in the root directory: ${resolvedRoot}`);
};

interface GetEnvPrefixParams {
  defaultPrefix: string;
  userEnvPrefix?: Partial<Prefix> | string;
}

export const get_env_prefix = ({ userEnvPrefix, defaultPrefix }: GetEnvPrefixParams) => {
  let client: string = defaultPrefix;

  let server: string | undefined;

  if (typeof userEnvPrefix === "string") {
    client = userEnvPrefix;
  } else if (userEnvPrefix) {
    client = userEnvPrefix.client ?? defaultPrefix;
    server = userEnvPrefix.server;
  }

  return {
    server,
    client,
  };
};

export interface GetEnvConfigParams {
  envDir: string;
  prefix: Pick<Partial<Prefix>, "server"> & Pick<Prefix, "client">;
}

export const get_env = ({ envDir, prefix }: GetEnvConfigParams, mode: string) => {
  const env = loadEnv(mode, envDir, "");

  return {
    public: filter_env(env, { prefix: prefix.client, ignore: prefix.server }),
    private: filter_env(env, { prefix: prefix.server, ignore: prefix.client }),
  };
};
