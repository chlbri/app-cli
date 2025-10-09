import { command, flag, restPositionals } from 'cmd-ts';
import { getFiles } from '../functions';
import { path } from './custom';
import { watcher } from './helpers';

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
      type: path,
    }),
  },
  handler: async ({ watch: persistent, files }) => {
    const isEmpty = files.length === 0;
    if (isEmpty) return console.warn('No files specified for generation.');

    const FILES = await getFiles(...files);
    if (FILES.length === 0) return console.warn('Files not found');

    return watcher(persistent, ...FILES);
  },
});
