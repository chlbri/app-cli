import { createMachine } from '@bemedev/app';

export default createMachine('actions', {
  initial: 'idle',
  states: { idle: {} },
});
