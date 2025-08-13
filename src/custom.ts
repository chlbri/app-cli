import type { AllEvent, EventsMap, EventToType, PromiseeMap, ToEvents } from './events';
import type { StateValue } from './states';
import type { PrimitiveObject } from './types';

export type WorkingStatus =
  | 'idle'
  | 'starting'
  | 'started'
  | 'paused'
  | 'working'
  | 'sending'
  | 'stopped'
  | 'busy';

// #region States

export type State<
  Tc extends PrimitiveObject = PrimitiveObject,
  E extends AllEvent = AllEvent,
> = {
  context: Tc;
  status: WorkingStatus;
  value: StateValue;
  event: E;
  tags?: string | readonly string[];
};

export type StateP<
  Tc extends PrimitiveObject = PrimitiveObject,
  E = any,
> = {
  context: Tc;
  status: WorkingStatus;
  value: StateValue;
  payload: E;
  tags?: string | readonly string[];
};

export type StateExtended<
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  E extends AllEvent = AllEvent,
> = {
  pContext: Pc;
} & State<Tc, E>;

export type StatePextended<
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  E = any,
> = {
  pContext: Pc;
} & StateP<Tc, E>;

// #endregion

type _FnMap<
  E extends EventsMap = EventsMap,
  P extends PromiseeMap = PromiseeMap,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  R = any,
  TT extends ToEvents<E, P> = ToEvents<E, P>,
> = {
  [key in EventToType<TT>]?: (
    state: StatePextended<Pc, Tc, Extract<TT, { type: key }>['payload']>,
  ) => R;
} & {
  else?: FnR<E, P, Pc, Tc, R>;
};

export type FnR<
  E extends EventsMap = EventsMap,
  P extends PromiseeMap = PromiseeMap,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  R = any,
> = (state: StateExtended<Pc, Tc, ToEvents<E, P>>) => R;

export type FnMap<
  E extends EventsMap = EventsMap,
  P extends PromiseeMap = PromiseeMap,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  R = any,
> = FnR<E, P, Pc, Tc, R> | _FnMap<E, P, Pc, Tc, R, ToEvents<E, P>>;
