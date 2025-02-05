export const Method = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
  PATCH: "PATCH",
  OPTIONS: "OPTIONS",
  HEAD: "HEAD",
} as const;

export type KeyOfMethod = keyof typeof Method;

export type ValueOfMethod = (typeof Method)[KeyOfMethod];

export enum MethodEnum {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH",
  OPTIONS = "OPTIONS",
  HEAD = "HEAD",
}

export type KeyOfMethodEnum = keyof typeof MethodEnum;

export type ValueOfMethodEnum = (typeof MethodEnum)[KeyOfMethodEnum];
