import { watch } from 'chokidar';
import { generate } from '../functions';

export const start = () => {
  const STARS = '*'.repeat(36);
  const TIRETS = '-'.repeat(36);

  console.log();
  console.log(STARS);
  console.log();
  console.log('Ready to generate types for machine files');
  console.log();
  console.log(TIRETS);
  console.log();
  console.log('Watching for changes...');
  console.log();
  console.log(TIRETS);
  console.log();
};

export const watcher = (persistent: boolean, ...files: string[]) => {
  const watcher = watch(files, {
    cwd: process.cwd(),
    persistent,
  })
    .once('add', start)
    .on('all', (_, file) => generate(file))
    .on('add', file => console.log(`File added: ${file}`))
    .on('change', file => console.log(`File changed: ${file}`))
    .on('unlink', file => {
      console.log(`File removed: ${file}`);
      watcher.unwatch(file);
    });

  return watcher;
};
