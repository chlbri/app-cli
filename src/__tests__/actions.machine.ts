import { createMachine, typings } from '@bemedev/app';

export default createMachine(
  'actions',
  {
    initial: 'idle',
    states: { idle: {} },
  },
  {
    pContext: typings.pContext({
      count: 'number',
    }),
  },
);
