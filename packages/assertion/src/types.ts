export type AnyFunction = (...args: any[]) => any;

export type Dict<T = any> = Record<string, T>;

export type Primitive = string | number | boolean | null | undefined;

export type PrimitiveObject = Dict<Primitive>;
