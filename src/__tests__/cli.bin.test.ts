import { addTarball, cleanup } from '@bemedev/build-tests';
import { existsSync } from 'node:fs';
import { exec, ShellString } from 'shelljs';
import { BIN, DESCRIPTION } from '../constants';
import { usePrepare } from './fixtures/hooks';

const timeout = 100_000;
describe('Tests the generated bin', () => {
  usePrepare();

  const COMMAND = `pnpm ${BIN}`;

  beforeAll(addTarball, timeout);
  afterAll(cleanup, timeout);

  describe('#01 => Help command', () => {
    describe('#01.01 => Main', () => {
      let result: ShellString;
      it(
        '#01.01.01 => Executes successfully',
        async () => {
          result = exec(`${COMMAND} --help`, {
            silent: true,
            timeout,
          });

          expect(result.code).toBe(1);
        },
        timeout,
      );

      describe('#01.01.02 => Output content', () => {
        describe('#01.01.02.01 => Contains available commands', () => {
          it('#01.01.02.01.01 => Contains main description', () => {
            expect(result.stdout).toContain(DESCRIPTION);
          });
          it('#01.01.02.01.02 => Contains generate "generate" command', () => {
            expect(result.stdout).toContain('generate');
          });

          it('#01.01.02.01.03 => Contains generate "generateOne" command', () => {
            expect(result.stdout).toContain('generateOne');
          });
        });
      });
    });

    describe('#01.02 => generate', () => {
      let result: ShellString;

      it(
        '#01.02.01 => Executes successfully',
        async () => {
          result = exec(`${COMMAND} generate -h`, {
            silent: true,
            timeout,
          });

          expect(result.code).toBe(1);
        },
        timeout,
      );

      describe('#01.01.02 => Output content', () => {
        describe('#01.01.02.01 => Contains available commands', () => {
          describe('#01.01.02.01.01 => Contains FLAGS', () => {
            it('#01.01.02.01.01.01 => Contains "FLAGS"', () => {
              expect(result.stdout).toContain('FLAGS');
            });

            it('#01.01.02.01.01.02 => Contains "--watch"', () => {
              expect(result.stdout).toContain('--watch');
            });

            it('#01.01.02.01.01.03 => Contains "-h"', () => {
              expect(result.stdout).toContain('-h');
            });

            it('#01.01.02.01.01.04 => Contains "--help"', () => {
              expect(result.stdout).toContain('--help');
            });

            it('#01.01.02.01.01.05 => Contains "-w"', () => {
              expect(result.stdout).toContain('-w');
            });
          });

          it('#01.01.02.01.02 => Contains generate "generate" command', () => {
            expect(result.stdout).toContain('generate');
          });
        });
      });
    });

    describe('#01.03 => generateOne', () => {
      let result: ShellString;

      it(
        '#01.03.01 => Executes successfully',
        async () => {
          result = exec(`${COMMAND} generateOne -h`, {
            silent: true,
            timeout,
          });

          expect(result.code).toBe(1);
        },
        timeout,
      );

      describe('#01.03.02 => Output content', () => {
        describe('#01.03.02.01 => Contains available commands', () => {
          describe('#01.03.02.01.01 => Contains FLAGS', () => {
            it('#01.03.02.01.01.01 => Contains "FLAGS"', () => {
              expect(result.stdout).toContain('FLAGS');
            });

            it('#01.03.02.01.01.02 => Contains "--watch"', () => {
              expect(result.stdout).toContain('--watch');
            });

            it('#01.03.02.01.01.03 => Contains "-h"', () => {
              expect(result.stdout).toContain('-h');
            });

            it('#01.03.02.01.01.04 => Contains "--help"', () => {
              expect(result.stdout).toContain('--help');
            });

            it('#01.03.02.01.01.05 => Contains "-w"', () => {
              expect(result.stdout).toContain('-w');
            });

            it('#01.03.02.01.01.06 => Contains "--strict"', () => {
              expect(result.stdout).toContain('--strict');
            });

            it('#01.03.02.01.01.07 => Contains "-s"', () => {
              expect(result.stdout).toContain('-s');
            });
          });

          it('#01.03.02.01.02 => Contains generateOne "generateOne" command', () => {
            expect(result.stdout).toContain('generateOne');
          });
        });
      });
    });
  });

  describe('#02 => Command generate', () => {
    let result: ShellString;

    const { checkExistence } = usePrepare();

    checkExistence('#02.00', false);

    it(
      '#02.01 => Executes successfully',
      async () => {
        result = exec(`${COMMAND} generate`, {
          silent: true,
          timeout,
        });

        expect(result.code).toBe(0);
      },
      timeout,
    );

    checkExistence('#02.02', true);
  });

  describe('#02 => Command generateOne', () => {
    describe('#02.01 => One file', () => {
      let result: ShellString;

      const { checkExistence, FILES, GEN_FILES } = usePrepare();

      checkExistence('#02.01.00', false);

      it(
        '#02.01.01 => Executes successfully',
        async () => {
          result = exec(`${COMMAND} generateOne ${FILES[0]}`, {
            silent: true,
            timeout,
          });

          expect(result.code).toBe(0);
        },
        timeout,
      );

      describe(`#02.01.02 => Some gen files are created`, () => {
        it.each(
          GEN_FILES.map((file, index) => {
            return [
              `#02.01.02.0${index + 1} => "${file}" is ${index === 0 ? 'generated' : 'deleted'}`,
              file,
              index,
            ] as const;
          }),
        )('%s', (_, file, index) => {
          const exists = index === 0;
          const _exists = existsSync(file);
          expect(_exists).toBe(exists);
        });
      });
    });

    describe('#02.02 => Two Files', () => {
      let result: ShellString;

      const { checkExistence, FILES, GEN_FILES } = usePrepare();

      checkExistence('#02.02.00', false);

      it(
        '#02.02.01 => Executes successfully',
        async () => {
          result = exec(`${COMMAND} generateOne ${FILES[2]} ${FILES[1]}`, {
            silent: true,
            timeout,
          });

          expect(result.code).toBe(0);
        },
        timeout,
      );

      describe(`#02.02.02 => Some gen files are created`, () => {
        it.each(
          GEN_FILES.map((file, index) => {
            return [
              `#02.02.02.0${index + 1} => "${file}" is ${index === 1 || index === 2 ? 'generated' : 'deleted'}`,
              file,
              index,
            ] as const;
          }),
        )('%s', (_, file, index) => {
          const exists = index === 1 || index === 2;
          const _exists = existsSync(file);
          expect(_exists).toBe(exists);
        });
      });
    });
  });
});

describe('#debug', () => {
  it('Add Tarball', addTarball, timeout);
  it('Cleanup', cleanup, timeout);
});
