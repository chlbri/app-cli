import { createMachine, typings } from '@bemedev/app-ts';
import { __tsSchemas } from './config3.machine.gen';

export const config3 = createMachine(
  {
    __tsSchema: __tsSchemas.config3,
    description: 'User authentication flow',
    machines: 'auth',
    initial: 'idle',
    states: {
      idle: {
        description: 'Initial state - not authenticated',
        activities: {
          CHECK_TOKEN: 'validateStoredToken',
        },
        on: {
          DATA: '/',
        },
      },

      authenticating: {
        description: 'Authentication in progress',
        type: 'parallel',

        states: {
          credentials: {
            description: 'Handling credentials',
            initial: 'gathering',
            states: {
              gathering: {
                description: 'Collecting user input',
                activities: {
                  VALIDATE_EMAIL: {
                    guards: 'isValidEmail',
                    actions: 'highlightEmailField',
                  },
                  VALIDATE_PASSWORD: {
                    guards: 'isValidPassword',
                    actions: 'highlightPasswordField',
                  },
                },
              },

              validating: {
                description: 'Server-side validation',
                activities: {
                  API_CALL: 'sendCredentialsToServer',
                },
                initial: 'pending',

                states: {
                  pending: {
                    activities: {
                      SHOW_SPINNER: 'displayLoadingSpinner',
                    },
                  },

                  success: {
                    activities: {
                      STORE_TOKEN: 'saveAuthToken',
                    },
                  },

                  failure: {
                    activities: {
                      SHOW_ERROR: 'displayErrorMessage',
                    },
                  },
                },
              },
            },
          },

          session: {
            description: 'Session management',
            activities: {
              SETUP_SESSION: 'initializeUserSession',
              REFRESH_TOKEN: 'scheduleTokenRefresh',
            },
          },
        },
      },

      authenticated: {
        description: 'User is logged in',
        entry: ['logSuccessfulAuth', 'redirectToApp'],
        initial: 'active',

        states: {
          active: {
            description: 'User is actively using the app',
            activities: {
              TRACK_ACTIVITY: 'recordUserActivity',
              EXTEND_SESSION: {
                guards: 'shouldExtendSession',
                actions: 'refreshSessionToken',
              },
            },
          },

          idle: {
            description: 'User is inactive but still logged in',
            activities: {
              WARN_TIMEOUT: 'showTimeoutWarning',
            },
          },
        },
      },

      loggedOut: {
        description: 'User has been logged out',
        entry: ['clearUserData', 'redirectToLogin'],
        activities: {
          CLEANUP: 'performCleanup',
        },
      },
    },
  },
  typings({
    eventsMap: {
      DATA: 'primitive',
    },
  }),
);
