import { run } from 'cmd-ts';
import { generate } from './generate';

describe('generate command', () => {
  it('#01 => Simple, no watch', () => run(generate, []));

  it('#02 => Watch', () => run(generate, ['--watch']));
});
