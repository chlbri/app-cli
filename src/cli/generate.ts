import { command, flag } from 'cmd-ts';
import { glob } from 'node:fs/promises';
import { MATCHES } from '../constants';
import { watcher } from './helpers';

export const generate = command({
  name: 'generate',
  aliases: ['gen'],

  args: {
    watch: flag({
      description: 'The hook watch',
      short: 'w',
      long: 'watch',
      env: 'APP_TYPINGS_WATCH',
    }),
  },
  handler: async ({ watch: persistent }) => {
    const FILES = await Array.fromAsync(glob(MATCHES));

    return watcher(persistent, ...FILES);
  },
});
