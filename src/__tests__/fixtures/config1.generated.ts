import type { CommonNodeConfig } from '../../states';
import type { TransitionsConfig } from '../../transitions';

export type AllPaths =
  '/'
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
      readonly strict: false;
      readonly machines: "";
      readonly states: {
        readonly idle: (CommonNodeConfig &
      TransitionsConfig<Exclude<AllPaths, '/idle'>>) & {
      readonly activities: {"DELAY":"inc"};
      readonly strict: false;
    };
        readonly working: (CommonNodeConfig &
      TransitionsConfig<Exclude<AllPaths, '/working'>>) & {
      readonly activities: {"DELAY2":"inc2"};
      readonly strict: false;
      readonly states: {
        readonly fetch: (CommonNodeConfig &
      TransitionsConfig<Exclude<AllPaths, '/working/fetch'>>) & {
      readonly strict: false;
      readonly states: {
        readonly idle: (CommonNodeConfig &
      TransitionsConfig<Exclude<AllPaths, '/working/fetch/idle'>>) & {
      readonly activities: {"DELAY":"sendPanelToUser"};
      readonly strict: false;
    };
        readonly fetch: (CommonNodeConfig &
      TransitionsConfig<Exclude<AllPaths, '/working/fetch/fetch'>>) & {
      readonly activities: {};
      readonly strict: false;
    };
      };
      readonly initial: 'idle' | 'fetch';
    };
        readonly ui: (CommonNodeConfig &
      TransitionsConfig<Exclude<AllPaths, '/working/ui'>>) & {
      readonly strict: false;
      readonly states: {
        readonly idle: (CommonNodeConfig &
      TransitionsConfig<Exclude<AllPaths, '/working/ui/idle'>>) & {
      readonly strict: false;
    };
        readonly input: (CommonNodeConfig &
      TransitionsConfig<Exclude<AllPaths, '/working/ui/input'>>) & {
      readonly activities: {"DELAY":{"guards":"isInputEmpty","actions":"askUsertoInput"}};
      readonly strict: false;
      readonly states: {
        readonly data: (CommonNodeConfig &
      TransitionsConfig<Exclude<AllPaths, '/working/ui/input/data'>>) & {
      readonly strict: false;
    };
      };
      readonly initial: 'data';
    };
        readonly final: (CommonNodeConfig &
      TransitionsConfig<Exclude<AllPaths, '/working/ui/final'>>) & {
      readonly strict: false;
    };
      };
      readonly initial: 'idle' | 'input' | 'final';
    };
      };
    };
        readonly final: (CommonNodeConfig &
      TransitionsConfig<Exclude<AllPaths, '/final'>>) & {
      readonly strict: false;
    };
      };
      readonly initial: 'idle' | 'working' | 'final';
    };