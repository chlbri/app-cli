import { createMachine, typings } from '@bemedev/app-ts';
import { __tsSchemas } from './config1.machine.gen';

export const config1 = createMachine(
  {
    __tsSchema: __tsSchemas.config1,
    machines: 'machine1',
    initial: 'idle',
    states: {
      idle: {
        activities: {
          DELAY: 'inc',
        },
      },

      working: {
        type: 'parallel',
        activities: {
          DELAY2: 'inc2',
        },

        states: {
          fetch: {
            initial: 'idle',
            states: {
              idle: {
                activities: {
                  DELAY: 'sendPanelToUser',
                },
              },
              fetch: {
                activities: {},
              },
            },
          },
          ui: {
            initial: 'idle',
            states: {
              idle: {},
              input: {
                initial: 'data',
                activities: {
                  DELAY: {
                    guards: 'isInputEmpty',
                    actions: 'askUsertoInput',
                  },
                },
                states: {
                  data: {},
                },
              },
              final: {},
            },
          },
        },
      },
      final: {},
    },
  },
  typings({}),
);
