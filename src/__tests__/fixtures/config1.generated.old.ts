/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { CommonNodeConfig } from '../../states';
import type { TransitionsConfig } from '../../transitions';

export type AllPaths =
  | '/'
  | '/idle'
  | '/working'
  | '/working/fetch'
  | '/working/fetch/idle'
  | '/working/fetch/fetch'
  | '/working/ui'
  | '/working/ui/idle'
  | '/working/ui/input'
  | '/working/ui/input/data'
  | '/working/ui/final'
  | '/final';

export type Enriched = (CommonNodeConfig &
  TransitionsConfig<Exclude<AllPaths, '/'>>) & {
  readonly type: 'compound';
  readonly states: {
    readonly idle: (CommonNodeConfig &
      TransitionsConfig<Exclude<AllPaths, '/idle'>>) & {
      readonly activities: { DELAY: 'inc' };
      readonly type: 'atomic';
    };
    readonly working: (CommonNodeConfig &
      TransitionsConfig<Exclude<AllPaths, '/working'>>) & {
      readonly activities: { DELAY2: 'inc2' };
      readonly type: 'parallel';
      readonly states: {
        readonly fetch: (CommonNodeConfig &
          TransitionsConfig<Exclude<AllPaths, '/working/fetch'>>) & {
          readonly type: 'compound';
          readonly states: {
            readonly idle: (CommonNodeConfig &
              TransitionsConfig<
                Exclude<AllPaths, '/working/fetch/idle'>
              >) & {
              readonly type: 'atomic';
            } & {
              readonly activities: { DELAY: 'sendPanelToUser' };
              readonly type: 'atomic';
            };
            readonly fetch: (CommonNodeConfig &
              TransitionsConfig<
                Exclude<AllPaths, '/working/fetch/fetch'>
              >) & {
              readonly activities: {};
              readonly type: 'atomic';
            };
          };
          readonly initial: 'idle' | 'fetch';
        };
        readonly ui: (CommonNodeConfig &
          TransitionsConfig<Exclude<AllPaths, '/working/ui'>>) & {
          readonly type: 'compound';
          readonly states: {
            readonly idle: (CommonNodeConfig &
              TransitionsConfig<Exclude<AllPaths, '/working/ui/idle'>>) & {
              readonly type: 'atomic';
            };
            readonly input: (CommonNodeConfig &
              TransitionsConfig<
                Exclude<AllPaths, '/working/ui/input'>
              >) & {
              readonly activities: {
                DELAY: {
                  guards: 'isInputEmpty';
                  actions: 'askUsertoInput';
                };
              };
              readonly type: 'compound';
              readonly states: {
                readonly data: (CommonNodeConfig &
                  TransitionsConfig<
                    Exclude<AllPaths, '/working/ui/input/data'>
                  >) & {
                  readonly type: 'atomic';
                };
              };
              readonly initial: 'data';
            };
            readonly final: (CommonNodeConfig &
              TransitionsConfig<
                Exclude<AllPaths, '/working/ui/final'>
              >) & {
              readonly type: 'atomic';
            };
          };
          readonly initial: 'idle' | 'input' | 'final';
        };
      };
      readonly initial: 'fetch' | 'ui';
    };
    readonly final: (CommonNodeConfig &
      TransitionsConfig<Exclude<AllPaths, '/final'>>) & {
      readonly type: 'atomic';
    };
  };
  readonly initial: 'idle' | 'working' | 'final';
};
