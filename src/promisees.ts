import type { ActionConfig } from './actions';
import type { FnMap, FnR } from './custom';
import type { EventsMap, PromiseeMap, ToEvents } from './events';
import type {
  SingleOrArrayT,
  Transition,
  TransitionConfigMapA,
} from './transitions';
import type { PrimitiveObject, Require } from './types';

/**
 * A function type that represents a promise function with map.
 *
 * @template : {@linkcode EventsMap} [E] - The events map.
 * @template : {@linkcode PromiseeMap} [P] - The promisees map.
 * @template Pc - The context type, defaults to `any`.
 * @template : {@linkcode PrimitiveObject} [Tc] - The primitive object type, defaults to `PrimitiveObject`.
 *
 * @see {@linkcode FnMap} for more details.
 * @see {@linkcode Promise} for a reduced version of this type.
 * @see {@linkcode PromiseFunction2} for a reduced version with a context.
 */
export type PromiseFunction<
  E extends EventsMap = EventsMap,
  P extends PromiseeMap = PromiseeMap,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
> = FnMap<E, P, Pc, Tc, Promise<any>>;

/**
 * A reduced version of {@linkcode PromiseFunction} that takes a context.
 *
 * @template : {@linkcode EventsMap} [E] - The events map.
 * @template : {@linkcode PromiseeMap} [P] - The promisees map.
 * @template Pc - The context type, defaults to `any`.
 * @template : {@linkcode PrimitiveObject} [Tc] - The primitive object type, defaults to `PrimitiveObject`.
 *
 * @see {@linkcode FnR} for more details.
 * @see {@linkcode Promise}
 */
export type PromiseFunction2<
  E extends EventsMap = EventsMap,
  P extends PromiseeMap = PromiseeMap,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
> = FnR<E, P, Pc, Tc, Promise<any>>;

/**
 * The finally part of a promise configuration.
 *
 * @see {@linkcode TransitionConfigMapA} for the type of transition configurations.
 * @see {@linkcode ActionConfig} for the type of action configurations.
 * @see {@linkcode NOmit}
 * @see {@linkcode Require}
 */
export type FinallyConfig<Paths extends string> =
  TransitionConfigMapA<Paths> extends infer F extends
    TransitionConfigMapA<Paths>
    ?
        | (F | ActionConfig)
        | readonly [...Require<F, 'guards'>[], F | ActionConfig]
    : never;

/**
 * Represents a promisee configuration.
 *
 * @see {@linkcode SingleOrArrayT} for the type of then and catch.
 * @see {@linkcode FinallyConfig} for the type of finally.
 */
export type PromiseeConfig<Paths extends string> = {
  readonly src: string;

  // Max wait time to perform the promise
  readonly max?: string;
  readonly description?: string;
  readonly then: SingleOrArrayT<Paths>;
  readonly catch: SingleOrArrayT<Paths>;
  readonly finally?: FinallyConfig<Paths>;
};

/**
 * A big one !
 *
 * Represents a promisee object with a source function, and full transitions for `then`, `catch`, and `finally`.
 *
 * @template : {@linkcode EventsMap} [E] - The events map.
 * @template : {@linkcode PromiseeMap} [P] - The promisees map.
 * @template Pc - The context type, defaults to `any`.
 * @template : {@linkcode PrimitiveObject} [Tc] - The primitive object type
 *
 * @see {@linkcode PromiseFunction2} for the type of the source function.
 * @see {@linkcode Transition} for the type of transitions.
 */
export type Promisee<
  E extends EventsMap = EventsMap,
  P extends PromiseeMap = PromiseeMap,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
> = {
  src: PromiseFunction2<E, P, Pc, Tc>;
  description?: string;
  then: Transition<E, P, Pc, Tc>[];
  catch: Transition<E, P, Pc, Tc>[];
  finally: Transition<E, P, Pc, Tc>[];
};

/**
 * Represents the result of a promisee execution.
 *
 * @template E - The events map, defaults to {@linkcode EventsMap}.
 * @template P - The promisees map, defaults to {@linkcode PromiseeMap}.
 * @template Pc - The context type, defaults to `any`.
 * @template : {@linkcode PrimitiveObject} Tc - The primitive object type, defaults to `PrimitiveObject`.
 *
 * @see {@linkcode ToEvents} for converting events and promisees to a unified event type.
 * @see {@linkcode ActionResult} for the type of action results.
 */
export type PromiseeResult<
  E extends EventsMap = EventsMap,
  P extends PromiseeMap = PromiseeMap,
> = {
  event: ToEvents<E, P>;
  target: string | false;
};
