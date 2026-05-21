import type { PrivateContextFrom } from '@bemedev/app';

expectTypeOf<
  PrivateContextFrom<typeof import('./actions.machine').default>
>().toEqualTypeOf<{
  count: number;
}>();
