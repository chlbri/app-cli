import type { ActionConfig } from './actions';
import type {
  NodeConfig,
  NodeConfigCompound,
  NodeConfigParallel,
  StateType,
} from './states';
import type { SingleOrArrayL } from './types';

/**
 * Type représentant la config principale d'une machine à états, sans clés inconnues.
 */
export type Config = (NodeConfigCompound | NodeConfigParallel) & {
  readonly machines?: SingleOrArrayL<ActionConfig>;
  readonly strict?: boolean;
};

// Utilitaire pour interdire les clés inconnues
type NoExtraKeys<T> = T & {
  [K in Exclude<keyof T, keyof NodeConfig>]: never;
} & {
  states?: Record<string, NoExtraKeys<NodeConfig>>;
};

type NoExtraKeys2<T extends Config> = T & {
  [K in Exclude<keyof T, keyof Config>]: never;
} & {
  readonly states?: Record<string, NoExtraKeys<NodeConfig>>;
  readonly type?: StateType;
  readonly strict?: boolean;
};

export const createConfig = <const T extends Config>(
  config: NoExtraKeys2<T>,
) => config;
