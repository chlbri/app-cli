import type { CommonNodeConfig } from '../../states';
import type { TransitionsConfig } from '../../transitions';

export type AllPaths =
  | '/'
  | '/idle'
  | '/authenticating'
  | '/authenticating/credentials'
  | '/authenticating/credentials/gathering'
  | '/authenticating/credentials/validating'
  | '/authenticating/credentials/validating/pending'
  | '/authenticating/credentials/validating/success'
  | '/authenticating/credentials/validating/failure'
  | '/authenticating/session'
  | '/authenticated'
  | '/authenticated/active'
  | '/authenticated/idle'
  | '/loggedOut';

export type Enriched = (CommonNodeConfig &
  TransitionsConfig<Exclude<AllPaths, '/'>>) & {
  readonly description: 'User authentication flow';
  readonly strict: false;
  readonly machines: 'auth';
  readonly states: {
    readonly idle: (CommonNodeConfig &
      TransitionsConfig<Exclude<AllPaths, '/idle'>>) & {
      readonly description: 'Initial state - not authenticated';
      readonly activities: { CHECK_TOKEN: 'validateStoredToken' };
      readonly strict: false;
    };
    readonly authenticating: (CommonNodeConfig &
      TransitionsConfig<Exclude<AllPaths, '/authenticating'>>) & {
      readonly description: 'Authentication in progress';
      readonly strict: false;
      readonly states: {
        readonly credentials: (CommonNodeConfig &
          TransitionsConfig<
            Exclude<AllPaths, '/authenticating/credentials'>
          >) & {
          readonly description: 'Handling credentials';
          readonly strict: false;
          readonly states: {
            readonly gathering: (CommonNodeConfig &
              TransitionsConfig<
                Exclude<AllPaths, '/authenticating/credentials/gathering'>
              >) & {
              readonly description: 'Collecting user input';
              readonly activities: {
                VALIDATE_EMAIL: {
                  guards: 'isValidEmail';
                  actions: 'highlightEmailField';
                };
                VALIDATE_PASSWORD: {
                  guards: 'isValidPassword';
                  actions: 'highlightPasswordField';
                };
              };
              readonly strict: false;
            };
            readonly validating: (CommonNodeConfig &
              TransitionsConfig<
                Exclude<AllPaths, '/authenticating/credentials/validating'>
              >) & {
              readonly description: 'Server-side validation';
              readonly activities: { API_CALL: 'sendCredentialsToServer' };
              readonly strict: false;
              readonly states: {
                readonly pending: (CommonNodeConfig &
                  TransitionsConfig<
                    Exclude<
                      AllPaths,
                      '/authenticating/credentials/validating/pending'
                    >
                  >) & {
                  readonly activities: {
                    SHOW_SPINNER: 'displayLoadingSpinner';
                  };
                  readonly strict: false;
                };
                readonly success: (CommonNodeConfig &
                  TransitionsConfig<
                    Exclude<
                      AllPaths,
                      '/authenticating/credentials/validating/success'
                    >
                  >) & {
                  readonly activities: { STORE_TOKEN: 'saveAuthToken' };
                  readonly strict: false;
                };
                readonly failure: (CommonNodeConfig &
                  TransitionsConfig<
                    Exclude<
                      AllPaths,
                      '/authenticating/credentials/validating/failure'
                    >
                  >) & {
                  readonly activities: {
                    SHOW_ERROR: 'displayErrorMessage';
                  };
                  readonly strict: false;
                };
              };
              readonly initial: 'pending' | 'success' | 'failure';
            };
          };
          readonly initial: 'gathering' | 'validating';
        };
        readonly session: (CommonNodeConfig &
          TransitionsConfig<
            Exclude<AllPaths, '/authenticating/session'>
          >) & {
          readonly description: 'Session management';
          readonly activities: {
            SETUP_SESSION: 'initializeUserSession';
            REFRESH_TOKEN: 'scheduleTokenRefresh';
          };
          readonly strict: false;
        };
      };
    };
    readonly authenticated: (CommonNodeConfig &
      TransitionsConfig<Exclude<AllPaths, '/authenticated'>>) & {
      readonly description: 'User is logged in';
      readonly entry: ['logSuccessfulAuth', 'redirectToApp'];
      readonly strict: false;
      readonly states: {
        readonly active: (CommonNodeConfig &
          TransitionsConfig<
            Exclude<AllPaths, '/authenticated/active'>
          >) & {
          readonly description: 'User is actively using the app';
          readonly activities: {
            TRACK_ACTIVITY: 'recordUserActivity';
            EXTEND_SESSION: {
              guards: 'shouldExtendSession';
              actions: 'refreshSessionToken';
            };
          };
          readonly strict: false;
        };
        readonly idle: (CommonNodeConfig &
          TransitionsConfig<Exclude<AllPaths, '/authenticated/idle'>>) & {
          readonly description: 'User is inactive but still logged in';
          readonly activities: { WARN_TIMEOUT: 'showTimeoutWarning' };
          readonly strict: false;
        };
      };
      readonly initial: 'active' | 'idle';
    };
    readonly loggedOut: (CommonNodeConfig &
      TransitionsConfig<Exclude<AllPaths, '/loggedOut'>>) & {
      readonly description: 'User has been logged out';
      readonly entry: ['clearUserData', 'redirectToLogin'];
      readonly activities: { CLEANUP: 'performCleanup' };
      readonly strict: false;
    };
  };
  readonly initial:
    | 'idle'
    | 'authenticating'
    | 'authenticated'
    | 'loggedOut';
};
