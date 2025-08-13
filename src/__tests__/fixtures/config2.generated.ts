import type { CommonNodeConfig } from '../../states';
import type { TransitionsConfig } from '../../transitions';

export type AllPaths =
  | '/'
  | '/red'
  | '/yellow'
  | '/green'
  | '/green/walk'
  | '/green/noWalk'
  | '/maintenance'
  | '/maintenance/diagnostics'
  | '/maintenance/diagnostics/lightTest'
  | '/maintenance/diagnostics/sensorTest'
  | '/maintenance/logging';

export type Enriched = (CommonNodeConfig &
  TransitionsConfig<Exclude<AllPaths, '/'>>) & {
  readonly description: 'Simple traffic light state machine';
  readonly strict: false;
  readonly machines: 'trafficLight';
  readonly states: {
    readonly red: (CommonNodeConfig &
      TransitionsConfig<Exclude<AllPaths, '/red'>>) & {
      readonly description: 'Stop state';
      readonly entry: ['logRedEntry'];
      readonly exit: ['logRedExit'];
      readonly tags: ['stop', 'danger'];
      readonly activities: { TIMER: 'startRedTimer' };
      readonly strict: false;
    };
    readonly yellow: (CommonNodeConfig &
      TransitionsConfig<Exclude<AllPaths, '/yellow'>>) & {
      readonly description: 'Caution state';
      readonly entry: ['logYellowEntry'];
      readonly tags: ['caution'];
      readonly activities: {
        TIMER: 'startYellowTimer';
        BLINK: { guards: 'shouldBlink'; actions: 'blinkYellow' };
      };
      readonly strict: false;
    };
    readonly green: (CommonNodeConfig &
      TransitionsConfig<Exclude<AllPaths, '/green'>>) & {
      readonly description: 'Go state';
      readonly entry: ['logGreenEntry'];
      readonly tags: ['go', 'safe'];
      readonly activities: { TIMER: 'startGreenTimer' };
      readonly strict: false;
      readonly states: {
        readonly walk: (CommonNodeConfig &
          TransitionsConfig<Exclude<AllPaths, '/green/walk'>>) & {
          readonly description: 'Pedestrian crossing allowed';
          readonly activities: { WALK_SIGNAL: 'enableWalkSignal' };
          readonly strict: false;
        };
        readonly noWalk: (CommonNodeConfig &
          TransitionsConfig<Exclude<AllPaths, '/green/noWalk'>>) & {
          readonly description: 'Pedestrian crossing not allowed';
          readonly activities: { NO_WALK_SIGNAL: 'enableNoWalkSignal' };
          readonly strict: false;
        };
      };
      readonly initial: 'walk' | 'noWalk';
    };
    readonly maintenance: (CommonNodeConfig &
      TransitionsConfig<Exclude<AllPaths, '/maintenance'>>) & {
      readonly description: 'Maintenance mode';
      readonly strict: false;
      readonly states: {
        readonly diagnostics: (CommonNodeConfig &
          TransitionsConfig<
            Exclude<AllPaths, '/maintenance/diagnostics'>
          >) & {
          readonly description: 'Running diagnostics';
          readonly activities: {
            CHECK_LIGHTS: 'checkAllLights';
            CHECK_SENSORS: 'checkSensors';
          };
          readonly strict: false;
          readonly states: {
            readonly lightTest: (CommonNodeConfig &
              TransitionsConfig<
                Exclude<AllPaths, '/maintenance/diagnostics/lightTest'>
              >) & {
              readonly activities: {
                TEST_RED: 'testRedLight';
                TEST_YELLOW: 'testYellowLight';
                TEST_GREEN: 'testGreenLight';
              };
              readonly strict: false;
            };
            readonly sensorTest: (CommonNodeConfig &
              TransitionsConfig<
                Exclude<AllPaths, '/maintenance/diagnostics/sensorTest'>
              >) & {
              readonly activities: {
                TEST_MOTION: 'testMotionSensor';
                TEST_PRESSURE: 'testPressurePlate';
              };
              readonly strict: false;
            };
          };
          readonly initial: 'lightTest' | 'sensorTest';
        };
        readonly logging: (CommonNodeConfig &
          TransitionsConfig<Exclude<AllPaths, '/maintenance/logging'>>) & {
          readonly description: 'Maintenance logging';
          readonly activities: { LOG_STATUS: 'logMaintenanceStatus' };
          readonly strict: false;
        };
      };
    };
  };
  readonly initial: 'red' | 'yellow' | 'green' | 'maintenance';
};
