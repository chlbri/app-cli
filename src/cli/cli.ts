import { subcommands } from 'cmd-ts';
import { BIN, DESCRIPTION } from '../constants';
import { generate } from './generate';
import { generateOne } from './generateOne';

export const cli = subcommands({
  name: BIN,
  cmds: { generate, generateOne },
  description: DESCRIPTION,
  version: '0.1.0',
});
