import { existsSync, rmSync } from 'node:fs';
import { withoutExtension } from '../../functions';

export const usePrepare = () => {
  const FILES = [
    'src/__tests__/fixtures/data/config1.machine.ts',
    'src/__tests__/fixtures/data/config2.machine.ts',
    'src/__tests__/fixtures/data/config3.machine.ts',
  ];

  const GEN_FILES = FILES.map(withoutExtension).map(
    ({ extension, file }) => `${file}.gen${extension}`,
  );

  const func = () => {
    GEN_FILES.forEach(file => {
      rmSync(file, { force: true, recursive: true });
    });
  };

  const checkExistence = (start: string, exists = true) => {
    describe(`${start} => Gen files are ${exists ? '' : 'not '}created`, () => {
      it.each(
        GEN_FILES.map(
          (file, index) =>
            [
              `${start}.0${index + 1} => "${file}" is ${exists ? 'generated' : 'deleted'}`,
              file,
            ] as const,
        ),
      )('%s', (_, file) => {
        const _exists = existsSync(file);
        expect(_exists).toBe(exists);
      });
    });
  };

  beforeAll(func);
  afterAll(func);

  return {
    FILES,
    GEN_FILES,
    checkExistence,
  };
};
