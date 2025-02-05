export const Token = {
  Bearer: "Bearer",
  Basic: "Basic",
};

export type KeyOfToken = keyof typeof Token;

export type ValueOfToken = (typeof Token)[KeyOfToken];

export enum TokenEnum {
  Bearer = "Bearer",
  Basic = "Basic",
}

export type KeyOfTokenEnum = keyof typeof TokenEnum;

export type ValueOfTokenEnum = (typeof TokenEnum)[KeyOfTokenEnum];
