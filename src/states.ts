import type { Action, ActionConfig } from './actions';
import type { EventsMap, PromiseeMap } from './events';
import type { GuardConfig } from './guards';
import type { Transitions } from './transitions';
import type {
  Identify,
  PrimitiveObject,
  SingleOrArrayL,
  SingleOrArrayR,
} from './types';

export type StateType = 'atomic' | 'compound' | 'parallel';

export type NodeConfig =
  | NodeConfigAtomic
  | NodeConfigCompound
  | NodeConfigParallel;

export type SNC = NodeConfig;

export type NodesConfig = Record<
  string,
  NodeConfig & {
    [key in Exclude<keyof NodeConfig, keyof NodeConfig>]: never;
  }
>;

export type ActivityMap =
  | {
      guards: SingleOrArrayL<GuardConfig>;
      actions: SingleOrArrayL<ActionConfig>;
    }
  | ActionConfig;

export type ActivityArray = SingleOrArrayL<ActivityMap>;

export type ActivityConfig = Record<string, ActivityArray>;

export type CommonNodeConfig = {
  readonly description?: string;
  readonly entry?: SingleOrArrayR<ActionConfig>;
  readonly exit?: SingleOrArrayR<ActionConfig>;
  readonly tags?: SingleOrArrayR<string>;
  readonly activities?: ActivityConfig;
};

export type NodeConfigAtomic = CommonNodeConfig & {
  readonly type?: 'atomic';
  readonly states?: never;
};

export type NodeConfigCompound = CommonNodeConfig & {
  readonly type?: 'compound';
  readonly states: NodesConfig;
};

export type NodeConfigParallel = CommonNodeConfig & {
  readonly type: 'parallel';
  readonly states: NodesConfig;
};
export type StateValue = string | StateValueMap;

export interface StateValueMap {
  [key: string]: StateValue;
}

export type Node<
  E extends EventsMap = EventsMap,
  P extends PromiseeMap = PromiseeMap,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
> = {
  id?: string;
  description?: string;
  type: StateType;
  entry: Action<E, P, Pc, Tc>[];
  exit: Action<E, P, Pc, Tc>[];
  tags: string[];
  states: Identify<Node<E, P, Pc, Tc>>[];
  initial?: string;
} & Transitions<E, P, Pc, Tc>;
