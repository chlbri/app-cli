import { createConfig } from '../../config';

export const config1 = createConfig({
  machines: '',
  // on: {},

  states: {
    idle: {
      activities: {
        DELAY: 'inc',
      },
      // on: {},
    },

    working: {
      type: 'parallel',
      activities: {
        DELAY2: 'inc2',
      },

      states: {
        fetch: {
          // on: {},
          states: {
            idle: {
              activities: {
                DELAY: 'sendPanelToUser',
              },
              // on: {},
            },
            fetch: {
              activities: {},
            },
          },
        },
        ui: {
          states: {
            idle: {},
            input: {
              activities: {
                DELAY: {
                  guards: 'isInputEmpty',
                  actions: 'askUsertoInput',
                },
              },
              states: {
                data: {
                  // on: {},
                },
              },
            },
            final: {},
          },
        },
      },
    },
    final: {},
  },
});
