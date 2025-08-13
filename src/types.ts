import type { NodeConfig } from './states';

export type SingleOrArrayL<T> = T | readonly [...(readonly T[]), T];

export type Keys = keyof any;

/**
 * Describer keys used to define the name and description of an object.
 */
export const DESCRIBER_KEYS = ['name', 'description'] as const;

/**
 * Describer type that contains a name and a description.
 */
export type Describer = Record<(typeof DESCRIBER_KEYS)[number], string>;

export type FromDescriber<T extends Describer> = T['name'];

export type Primitive2 = string | number | boolean;
export type Primitive = Primitive2 | undefined | null;
export type SingleOrArray<T> = T | T[] | ReadonlyArray<T>;

export type Fn<Args extends any[] = any[], R = any> = (...args: Args) => R;

export type RecursiveArrayOf<T> =
  | Array<_SingleOrRecursiveArrayOf<T>>
  | ReadonlyArray<_SingleOrRecursiveArrayOf<T>>;
type _SingleOrRecursiveArrayOf<T> = T | RecursiveArrayOf<T>;

export type SingleOrRecursiveArrayOf<T> = T | RecursiveArrayOf<T>;
export type SoRa<T> = SingleOrRecursiveArrayOf<T>;

export type PrimitiveObjectMap = {
  [key: Keys]: PrimitiveObject;
};

export type PrimitiveObject = SoRa<Primitive | PrimitiveObjectMap>;

export type Unionize<T extends Record<string, any>> = {
  [P in keyof T]: {
    [Q in P]: T[P];
  };
}[keyof T];

export type DeepPartial<T> = T extends Primitive
  ? T
  : {
      [P in keyof T]?: T[P] extends Fn
        ? T[P]
        : T[P] extends object
          ? DeepPartial<T[P]>
          : T[P];
    };

export type Ru = Record<string, unknown>;

export type TrueObject = Ru & {
  [Symbol.iterator]?: never;
};

export type KeysMatching<
  T extends TrueObject,
  AddObjectKeys extends boolean = true,
  Key extends keyof T = keyof T,
> = Key extends string
  ? Required<T[Key]> extends TrueObject
    ?
        | `${Key}.${KeysMatching<Required<T[Key]>, AddObjectKeys> & string}`
        | (AddObjectKeys extends true ? Key : never)
    : Key
  : never;

export type ReduceArray<T> = T extends readonly (infer U1)[]
  ? U1
  : T extends (infer U2)[]
    ? U2
    : T;

export type NOmit<T, K extends keyof T> = Omit<T, K>;

export type Require<T, K extends keyof T> = NOmit<T, K> &
  Required<Pick<T, K>>;

export type NoU<T> = Exclude<T, undefined>;

export type Identify<T> = T extends object ? T & { __id: string } : T;

export type SingleOrArrayR<T> = T | readonly T[];

export type UnionKeys<U> = U extends Record<infer K, any> ? K : never;
export type _UnionToIntersection1<U> = boolean extends U
  ? U
  : (U extends any ? (k: U) => void : never) extends (k: infer I) => void
    ? I
    : never;
export type _UnionToIntersection2<U> = {
  [K in UnionKeys<U>]: U extends Record<K, infer T> ? T : never;
};
export type UnionToIntersection<U> = _UnionToIntersection2<
  _UnionToIntersection1<U>
>;

export type NoExtraKeys<T, U = Record<keyof T, any>> = T & {
  [K in Exclude<keyof T, keyof U>]: never;
};

/**
 * Version récursive de NoExtraKeys : interdit les clés inconnues à tous les niveaux d'un objet.
 */
export type NoExtraKeysDeep<
  T,
  U extends keyof T = keyof T,
> = T extends object
  ? T & {
      [K in Exclude<keyof T, U>]: never;
    } & (T extends { states: Record<string, any> }
        ? {
            states?: Record<
              string,
              NoExtraKeysDeep<NodeConfig, keyof NodeConfig>
            >;
          }
        : {
            [K in Exclude<keyof T, keyof NodeConfig>]: never;
          })
  : T;
