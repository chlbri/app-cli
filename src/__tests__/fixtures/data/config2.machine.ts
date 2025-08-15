import { createMachine, typings } from '@bemedev/app-ts';

export const config2 = createMachine(
  {
    description: 'Simple traffic light state machine',
    machines: 'trafficLight',

    initial: 'red',
    states: {
      red: {
        description: 'Stop state',
        activities: {
          TIMER: 'startRedTimer',
        },
        entry: ['logRedEntry'],
        exit: ['logRedExit'],
        tags: ['stop', 'danger'],
      },

      yellow: {
        description: 'Caution state',
        activities: {
          TIMER: 'startYellowTimer',
          BLINK: {
            guards: 'shouldBlink',
            actions: 'blinkYellow',
          },
        },
        entry: ['logYellowEntry'],
        tags: ['caution'],
      },

      green: {
        description: 'Go state',
        type: 'compound',
        activities: {
          TIMER: 'startGreenTimer',
        },
        entry: ['logGreenEntry'],
        tags: ['go', 'safe'],

        initial: 'walk',

        states: {
          walk: {
            description: 'Pedestrian crossing allowed',
            activities: {
              WALK_SIGNAL: 'enableWalkSignal',
            },
          },

          noWalk: {
            description: 'Pedestrian crossing not allowed',
            activities: {
              NO_WALK_SIGNAL: 'enableNoWalkSignal',
            },
          },
        },
      },

      maintenance: {
        description: 'Maintenance mode',
        type: 'parallel',

        states: {
          diagnostics: {
            description: 'Running diagnostics',
            activities: {
              CHECK_LIGHTS: 'checkAllLights',
              CHECK_SENSORS: 'checkSensors',
            },
            initial: 'lightTest',

            states: {
              lightTest: {
                activities: {
                  TEST_RED: 'testRedLight',
                  TEST_YELLOW: 'testYellowLight',
                  TEST_GREEN: 'testGreenLight',
                },
              },

              sensorTest: {
                activities: {
                  TEST_MOTION: 'testMotionSensor',
                  TEST_PRESSURE: 'testPressurePlate',
                },
              },
            },
          },

          logging: {
            description: 'Maintenance logging',
            activities: {
              LOG_STATUS: 'logMaintenanceStatus',
            },
          },
        },
      },
    },
  },
  typings({}),
);
