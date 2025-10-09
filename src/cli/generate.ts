import { command, flag } from 'cmd-ts';
import { getFiles } from '../functions';
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
  handler: async ({ watch }) => {
    const FILES = await getFiles();
    return watcher(watch, ...FILES);
  },
});
