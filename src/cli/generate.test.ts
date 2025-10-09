import sleep from '@bemedev/sleep';
import { run } from 'cmd-ts';
import { usePrepare } from '../__tests__/fixtures/hooks';
import { generate } from './generate';

describe('generate command', () => {
  const { checkExistence, FILES } = usePrepare();
  let watcheds: any;

  checkExistence('#00', false);
  it('#01 => Run the command', async () => {
    const result = await run(generate, []);

    await sleep(2_000);
    watcheds = result.getWatched();
    result.close();
  }, 100_000);
  checkExistence('#02', true);

  describe('#03 => Checks', () => {
    describe('#01 => Only one folder', () => {
      it('01 => Length', () => {
        expect(Object.keys(watcheds)).toHaveLength(1);
      });

      it('02 => Has correct folder', () => {
        expect(watcheds).toHaveProperty('src/__tests__/fixtures/data');
      });

      describe('#02 => Files', () => {
        test.each(
          FILES.map(
            (file, index) =>
              [`#02.0${index + 1} => "${file}" is watched`, file] as const,
          ),
        )('%s', (_, file) => {
          // const files = watcheds['src/__tests__/fixtures/data'];
          expect(watcheds['src/__tests__/fixtures/data']).toContain(
            file.split('/').pop(),
          );
        });
      });
    });
  });
});
