import { GENERATED_COMMENT } from "./constants";
import { create_import_meta_env, create_process_env, create_static_types } from "./generate";
import type { Env, RuntimeEnv } from "./types";

export const template = <ClientEnv extends RuntimeEnv = RuntimeEnv, ServerEnv extends RuntimeEnv = RuntimeEnv>(
  env: Env<ClientEnv, ServerEnv>,
) => `
  ${GENERATED_COMMENT}
  
  /// <reference types="vite/client" />
  
  ${create_import_meta_env(env.public)}
  
  ${create_static_types("private", env)}
  
  ${create_static_types("public", env)}
  `;

export const template_process_env = (env: RuntimeEnv) => `
  ${GENERATED_COMMENT}
  ${create_process_env(env)}
  `;
