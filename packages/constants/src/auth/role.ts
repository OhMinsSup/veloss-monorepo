export const Role = {
  ADMIN: "ADMIN",
  USER: "USER",
} as const;

export type KeyOfRole = keyof typeof Role;

export type ValueOfRole = (typeof Role)[KeyOfRole];

export enum RoleEnum {
  ADMIN = "ADMIN",
  USER = "USER",
}

export type KeyOfRoleEnum = keyof typeof RoleEnum;

export type ValueOfRoleEnum = (typeof RoleEnum)[KeyOfRoleEnum];
