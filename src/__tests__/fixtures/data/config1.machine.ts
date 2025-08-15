import { createMachine, typings } from '@bemedev/app-ts';

export const config1 = createMachine(
  {
    machines: 'machine1',
    initial: 'idle',
    states: {
      idle: {
        activities: {
          DELAY: 'inc',
        },
      },

      didi: {},

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
