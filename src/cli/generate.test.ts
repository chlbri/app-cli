import type { FSWatcher } from 'chokidar';
import { run } from 'cmd-ts';
import { usePrepare } from '../__tests__/fixtures/hooks';
import { generate } from './generate';

describe('generate command', () => {
  usePrepare();

  let out: void | FSWatcher;

  afterAll(() => {
    out?.close();
  });

  it('#01 => Simple, no watch', () => run(generate, []));

  it('#02 => Watch', async () => {
    out = await run(generate, ['--watch']);
  }, 4000);
});
