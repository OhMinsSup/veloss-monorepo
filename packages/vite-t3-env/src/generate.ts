import { GENERATED_COMMENT, reserved, valid_identifier } from "./constants";
import type { Env, Recordable, RuntimeEnv, SupportType } from "./types";
import { dedent } from "./utils";

export function create_static_module(id: string, env: RuntimeEnv) {
  const declarations: string[] = [];

  for (const key in env) {
    if (!valid_identifier.test(key) || reserved.has(key)) {
      continue;
    }

    const comment = `/** @type {import('${id}').${key}} */`;
    const declaration = `export const ${key} = ${JSON.stringify(env[key])};`;

    declarations.push(`${comment}\n${declaration}`);
  }

  return GENERATED_COMMENT + declarations.join("\n\n");
}

export function create_static_types<
  ClientEnv extends RuntimeEnv = RuntimeEnv,
  ServerEnv extends RuntimeEnv = RuntimeEnv,
>(id: string, env: Env<ClientEnv, ServerEnv>) {
  const declarations = Object.keys(env[id as keyof typeof env])
    .filter((k) => valid_identifier.test(k))
    .map((k) => `export const ${k}: string;`);

  return dedent`
          declare module '$env/static/${id}' {
              ${declarations.join("\n")}
          }
      `;
}

const typeMap: Recordable<SupportType> = {
  boolean: "boolean",
  string: "string",
  number: "number",
  array: "any[]",
  object: "Record<string, any>",
};

export function create_import_meta_env(env: RuntimeEnv) {
  const declarations = Object.keys(env)
    .filter((k) => valid_identifier.test(k))
    .map((k) => `readonly ${k}: ${typeMap[typeof env[k] as SupportType] || "any"};`);

  return dedent`
      interface ImportMetaEnv {
        ${declarations.join("\n")}
      }
	`;
}

export function create_process_env(env: RuntimeEnv) {
  const declarations = Object.keys(env)
    .filter((k) => valid_identifier.test(k))
    .map((k) => `readonly ${k}: ${typeMap[typeof env[k] as SupportType] || "any"};`);

  return dedent`
      declare namespace NodeJS {
        interface ProcessEnv {
          [key: string]: string;
          ${declarations.join("\n")}
        }
      }
    `;
}
