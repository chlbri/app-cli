import { watch } from 'chokidar';
import { command, flag, restPositionals, string } from 'cmd-ts';
import { glob } from 'node:fs/promises';
import { generateOne as generate } from '../functions/generate';
import { start } from './helpers';

export const generateOne = command({
  name: 'generateOne',
  aliases: ['genOne', 'genO'],

  args: {
    watch: flag({
      description: 'The hook watch',
      short: 'w',
      env: 'APP_TYPINGS_WATCH_ONE',
      long: 'watch',
    }),

    files: restPositionals({
      description: 'The files to generate',
      displayName: 'Files',
      type: string,
    }),

    strict: flag({
      description: 'Enable strict mode',
      short: 's',
      env: 'APP_TYPINGS_STRICT_ONE',
      long: 'strict',
    }),
  },
  handler: async ({ watch: persistent, files, strict }) => {
    const isEmpty = files.length === 0;
    if (isEmpty) return console.warn('No files specified for generation.');

    const FILES = await Array.fromAsync(
      glob(files, { cwd: process.cwd() }),
    );

    if (FILES.length === 0) return console.warn('Files not found');

    const hasMachineNames = FILES.every(file =>
      file.endsWith('.machine.ts'),
    );

    if (strict && !hasMachineNames) {
      return console.warn(
        'Strict, all machines names must ends with ".machine.ts"',
      );
    }

    const watcher = watch(FILES, {
      cwd: process.cwd(),

      awaitWriteFinish: {
        stabilityThreshold: 200,
        pollInterval: 100,
      },

      persistent,
    })
      .on('all', (_, file) => generate(file))
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
