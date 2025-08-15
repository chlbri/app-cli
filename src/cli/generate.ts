import { watch } from 'chokidar';
import { command, flag } from 'cmd-ts';
import { glob } from 'node:fs/promises';
import { MATCHES } from '../constants';
import { generateOne } from '../functions';
import { start } from './helpers';

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

    const watcher = watch(FILES, {
      cwd: process.cwd(),
      awaitWriteFinish: {
        stabilityThreshold: 200,
        pollInterval: 100,
      },
      persistent,
    })
      .on('all', (_, file) => generateOne(file))
      .once('add', start)
      .on('add', file => console.log(`File added: ${file}`))
      .on('change', file => console.log(`File changed: ${file}`))
      .on('unlink', file => {
        console.log(`File removed: ${file}`);
        watcher.unwatch(file);
      });

    return watcher;
  },
});
