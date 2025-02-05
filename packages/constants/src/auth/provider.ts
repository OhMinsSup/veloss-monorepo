export const Provider = {
  EMAIL: "email",
  PASSWORD: "password",
} as const;

export type KeyOfProvider = keyof typeof Provider;

export type ValueOfProvider = (typeof Provider)[KeyOfProvider];

export enum ProviderEnum {
  EMAIL = "email",
  PASSWORD = "password",
}

export type KeyOfProviderEnum = keyof typeof ProviderEnum;

export type ValueOfProviderEnum = (typeof ProviderEnum)[KeyOfProviderEnum];
