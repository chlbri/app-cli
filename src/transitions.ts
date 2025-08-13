import type { Action, ActionConfig, FromActionConfig } from './actions';
import type { EventsMap, PromiseeMap } from './events';
import type { FromGuard, GuardConfig, Predicate } from './guards';
import type { Promisee, PromiseeConfig } from './promisees';
import type {
  Identify,
  PrimitiveObject,
  ReduceArray,
  Require,
  SingleOrArrayL,
} from './types';

type _TransitionConfigMap<Paths extends string> = {
  readonly target?: Paths;
  readonly actions?: SingleOrArrayL<ActionConfig>;
  readonly guards?: SingleOrArrayL<GuardConfig>;
  readonly description?: string;
};
/**
 * Extracts actions from a transition configuration.
 *
 * @template T - The transition configuration type.
 * @returns The actions extracted from the transition configuration.
 *
 * @see {@linkcode ActionConfig} for the structure of action configurations.
 * @see {@linkcode FromActionConfig} for converting action configurations to actions.
 * @see {@linkcode ReduceArray} for reducing arrays to their elements.
 * @see {@linkcode SingleOrArrayL} for handling single or array
 */
export type ExtractActionsFromTransition<
  T extends {
    actions: SingleOrArrayL<ActionConfig>;
  },
> =
  ReduceArray<T['actions']> extends infer R extends ActionConfig
    ? FromActionConfig<R>
    : never;
/**
 * Extracts guards from a transition configuration.
 *
 * @template T - The transition configuration type.
 * @returns The guards extracted from the transition configuration.
 *
 * @see {@linkcode GuardConfig} for the structure of guard configurations.
 * @see {@linkcode FromGuard} for converting guard configurations to predicates.
 * @see {@linkcode ReduceArray} for reducing arrays to their elements.
 * @see {@linkcode SingleOrArrayL} for handling single or array
 */
export type ExtractGuardsFromTransition<
  T extends {
    guards: SingleOrArrayL<GuardConfig>;
  },
> =
  ReduceArray<T['guards']> extends infer R extends GuardConfig
    ? FromGuard<R>
    : never;
/**
 * A {@linkcode _TransitionConfigMap} that requires a target.
 */
export type TransitionConfigMapF<Paths extends string> = Require<
  _TransitionConfigMap<Paths>,
  'target'
>;
/**
 * A {@linkcode _TransitionConfigMap} that requires actions.
 */
export type TransitionConfigMapA<Paths extends string> = Require<
  _TransitionConfigMap<Paths>,
  'actions'
>;
/**
 * A better version {@linkcode _TransitionConfigMap}.
 *
 * This type is used to ensure that the transition configuration
 * has either a target or actions defined, but not both.
 *
 * @see {@linkcode TransitionConfigMapF} for a version that requires a target.
 * @see {@linkcode TransitionConfigMapA} for a version that requires actions.
 */
export type TransitionConfigMap<Paths extends string> =
  | TransitionConfigMapF<Paths>
  | TransitionConfigMapA<Paths>;
/**
 * A version {@linkcode TransitionConfigMap} with string declaration.
 */
export type TransitionConfig<Paths extends string> =
  | string
  | TransitionConfigMap<Paths>;
/**
 * A version {@linkcode TransitionConfigMapF} with string declaration.
 */
export type TransitionConfigF<Paths extends string> =
  | string
  | TransitionConfigMapF<Paths>;
/**
 * An array of transitions that can be used in a state machine.
 *
 * More difficult than a simple array of {@linkcode TransitionConfig}
 *
 * @see {@linkcode TransitionConfigMapF} for a version that requires a target.
 * @see {@linkcode TransitionConfigMapA} for a version that requires actions.
 * @see {@linkcode TransitionConfig} for a version that can be a string or a {@linkcode TransitionConfigMap}.
 * @see {@linkcode Require}
 */
export type ArrayTransitions<Paths extends string> = readonly [
  ...(
    | Require<TransitionConfigMapF<Paths>, 'guards'>
    | Require<TransitionConfigMapA<Paths>, 'guards'>
  )[],
  TransitionConfig<Paths>,
];
/**
 * A type that can be either an array of transitions or a single transition configuration.
 *
 * @see {@linkcode ArrayTransitions} for an array of transitions.
 * @see {@linkcode TransitionConfig} for a single transition configuration.
 */
export type SingleOrArrayT<Paths extends string> =
  | ArrayTransitions<Paths>
  | TransitionConfig<Paths>;
/**
 * Representation of a always transition config.
 *
 * @see {@linkcode ArrayTransitions} for an array of transitions.
 * @see {@linkcode TransitionConfigF} for a single transition configuration with a target.
 * @see {@linkcode Require}
 */
export type AlwaysConfig<Paths extends string> =
  | readonly [
      ...Require<TransitionConfigMap<Paths>, 'guards'>[],
      TransitionConfigF<Paths>,
    ]
  | TransitionConfigF<Paths>;
/**
 * A type used to represent a record of transitions.
 *
 * @remarks For the purpose of delay transition config.
 */
export type DelayedTransitions<Paths extends string> = Record<
  string,
  SingleOrArrayT<Paths>
>;
/**
 * Extracts action keys from a {@linkcode DelayedTransitions}.
 *
 * @template T - The delayed transitions type.
 *
 * @see {@linkcode ExtractActionsFromTransition} for extracting actions from a transition configuration.
 * @see {@linkcode ReduceArray} for reducing arrays to their elements.
 * @see {@linkcode SingleOrArrayL} for handling single or array
 * @see {@linkcode ActionConfig} for the structure of action configurations.
 *
 * @see {@linkcode ExtractGuardsFromTransition} for extracting guards from a transition configuration.
 */
export type ExtractActionKeysFromDelayed<T> = ExtractActionsFromTransition<
  Extract<
    ReduceArray<T[keyof T]>,
    {
      actions: SingleOrArrayL<ActionConfig>;
    }
  >
>;
/**
 * Extracts guards from a {@linkcode DelayedTransitions}.
 *
 * @template T - The delayed transitions type.
 *
 * @see {@linkcode ExtractGuardsFromTransition} for extracting guards from a transition configuration.
 * @see {@linkcode ReduceArray} for reducing arrays to their elements.
 * @see {@linkcode SingleOrArrayL} for handling single or array
 * @see {@linkcode GuardConfig} for the structure of guard configurations.
 *
 * @see {@linkcode ExtractActionsFromTransition} for extracting actions from a transition configuration.
 */
export type ExtractGuardKeysFromDelayed<T> = ExtractGuardsFromTransition<
  Extract<
    ReduceArray<T[keyof T]>,
    {
      guards: SingleOrArrayL<GuardConfig>;
    }
  >
>;
/**
 * Represents a JSON configuration for delayed transitions.
 *
 * @remarks This type is used to define transitions that occur after a delay.
 * It can include actions, guards, and promises.
 *
 * @see {@linkcode DelayedTransitions} for the structure of delayed transitions.
 * @see {@linkcode AlwaysConfig} for always transitions configuration.
 * @see {@linkcode PromiseeConfig} for promise configurations.
 * @see {@linkcode SingleOrArrayL} for handling single or array
 */
export type TransitionsConfig<Paths extends string> = {
  readonly on?: DelayedTransitions<Paths>;
  readonly always?: AlwaysConfig<Paths>;
  readonly after?: DelayedTransitions<Paths>;
  readonly promises?: SingleOrArrayL<PromiseeConfig<Paths>>;
};

export type Transition<
  E extends EventsMap,
  P extends PromiseeMap = PromiseeMap,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
> = {
  readonly target: string[];
  readonly actions: Action<E, P, Pc, Tc>[];
  readonly guards: Predicate<E, P, Pc, Tc>[];
  readonly description?: string;
  readonly in: string[];
};
/**
 * Represents all transitions inside a state config with full defined functions.
 *
 * @template : {@linkcode EventsMap} [E] - The events map used in the transitions.
 * @template : {@linkcode PromiseeMap} [P] - The promisees map used in the transitions.
 * @template : [Pc] - The private context type for the transitions.
 * @template : {@linkcode PrimitiveObject} [Tc] - The context for the transitions
 *
 * @see {@linkcode Transition} for the structure of a single transition.
 * @see {@linkcode Promisee} for the structure of promises in the transitions.
 * @see {@linkcode Identify} for identifying properties in the transitions.
 */
export type Transitions<
  E extends EventsMap,
  P extends PromiseeMap = PromiseeMap,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
> = {
  on: Identify<Transition<E, P, Pc, Tc>>[];
  always: Transition<E, P, Pc, Tc>[];
  after: Identify<Transition<E, P, Pc, Tc>>[];
  promises: Promisee<E, P, Pc, Tc>[];
};
