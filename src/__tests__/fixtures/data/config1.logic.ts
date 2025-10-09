import { createLogic } from '@bemedev/fsf';

type Context = { ready: boolean; result: string };
type Events = null;
type Data = string;

export const config1 = createLogic(
  {
    initial: 'check',
    data: 'output',
    context: { ready: false, result: '' },
    states: {
      check: {
        always: [
          {
            target: 'success',
            cond: 'isReady',
            actions: 'setSuccessResult',
          },
          { target: 'waiting', actions: 'setWaitingResult' },
        ],
      },
      success: { data: 'output' },
      waiting: { data: 'output' },
    },
  },
  {
    context: {} as Context,
    events: null as Events,
    data: {} as Data,
  },
).provideOptions({
  actions: {
    setSuccessResult: ctx => {
      ctx.result = 'Prêt !';
    },
    setWaitingResult: ctx => {
      ctx.result = 'En attente...';
    },
  },
  guards: {
    isReady: ctx => ctx.ready === true,
  },
  datas: {
    output: ctx => ctx.result,
  },
});
