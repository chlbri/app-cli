import sleep from '@bemedev/sleep';
import { run } from 'cmd-ts';
import { usePrepare } from '../__tests__/fixtures/hooks';
import { cli } from './cli';
import { generateOne } from './generateOne';

describe('generateOne command', () => {
  const spy = vi.spyOn(console, 'warn');

  describe('#01 => No files', () => {
    describe('#01.01 => Simple, no watch', () => {
      it('#01.01.01 => Result is undefined', async () => {
        const result = await run(generateOne, []);
        expect(result).toBeUndefined();
      });

      describe('#01.01.02 => Console warn', () => {
        it('#01.01.02.01 => Call times 1', () => {
          expect(spy).toHaveBeenCalledTimes(1);
        });
        it('#01.01.02.02 => Warns when "No files are specified"', () => {
          expect(spy).toHaveBeenNthCalledWith(
            1,
            'No files specified for generation.',
          );
        });
      });
    });

    describe('#01.02 => Watch', () => {
      it('#01.02.01 => Result is undefined', async () => {
        const result = await (
          await run(cli, ['generateOne', '--watch'])
        ).value;
        expect(result).toBeUndefined();
      });

      describe('#01.02.02 => Console warn', () => {
        it('#01.01.02.01 => Call times 2', () => {
          expect(spy).toHaveBeenCalledTimes(2);
        });

        it('#01.02.02.01 => Warns when "No files specified for generation"', () => {
          expect(spy).toHaveBeenNthCalledWith(
            2,
            'No files specified for generation.',
          );
        });
      });
    });
  });

  describe('#02 => With files', () => {
    describe('#02.01 => With files not exists', () => {
      const files = ['file1.ts', 'file2.ts'];

      describe('#02.01.01 => Simple, no watch', () => {
        it('#02.01.01.01 => Result is undefined', async () => {
          const result = await run(generateOne, files);
          expect(result).toBeUndefined();
        });

        describe('#02.01.01.02 => Console warn', () => {
          it('#02.01.01.02.01 => Call times 3', () => {
            expect(spy).toHaveBeenCalledTimes(3);
          });

          it('#02.01.01.02.02 => Warns when "Files not found"', () => {
            expect(spy).toHaveBeenCalledWith('Files not found');
          });
        });
      });

      describe('#02.01.02 => Watch', () => {
        it('#02.01.02.01 => Result is undefined', async () => {
          const result = await run(generateOne, ['-w', ...files]);
          expect(result).toBeUndefined();
        });

        describe('#02.01.02.02 => Console warn', () => {
          it('#02.01.02.02.01 => Call times 4', () => {
            expect(spy).toHaveBeenCalledTimes(4);
          });

          it('#02.01.02.02.02 => Warns when "Files not found"', () => {
            expect(spy).toHaveBeenLastCalledWith('Files not found');
          });
        });
      });
    });

    describe('#02.02 => With files exists', () => {
      describe('#02.02.01 => No strict mode', () => {
        usePrepare();
        describe('#02.02.01.01 => One file', () => {
          const files = ['src/__tests__/fixtures/data/config3.machine.ts'];
          let watcheds: any;

          describe('#02.02.01.01.01 => Simple, no watch', () => {
            it('#02.02.01.01.01.01 => Result is defined', async () => {
              const result = await run(generateOne, files);
              expect(result).toBeDefined();
              if (result) {
                await sleep(2000);
                watcheds = result.getWatched();
                result.close();
              }
            });

            describe('#02.02.01.01.02 => Watcheds', () => {
              describe('#02.02.01.01.02.01 => Folder', async () => {
                it('#02.02.01.01.02.01.01 => Only one folder', async () => {
                  expect(Object.keys(watcheds)).toHaveLength(1);
                });
                it('#02.02.01.01.02.01.02 => Has correct folder', async () => {
                  expect(watcheds).toHaveProperty(
                    'src/__tests__/fixtures/data',
                  );
                });
              });

              describe('#02.02.01.01.02.02 => Files', () => {
                it('#02.02.01.01.02.02.01 => Only on file', () => {
                  expect(
                    watcheds['src/__tests__/fixtures/data'],
                  ).toHaveLength(1);
                });
                it('#02.02.01.01.02.02.02 => Has correct files', async () => {
                  expect(watcheds['src/__tests__/fixtures/data']).toEqual([
                    'config3.machine.ts',
                  ]);
                });
              });
            });
          });
        });

        describe('#02.02.01.02 => Two files config1 & config2', () => {
          const files = [
            'src/__tests__/fixtures/data/config2.machine.ts',
            'src/__tests__/fixtures/data/config1.machine.ts',
          ];
          let watcheds: any;

          describe('#02.02.01.02.01 => Simple, no watch', () => {
            it('#02.02.01.02.01.01 => Result is defined', async () => {
              const result = await run(generateOne, files);
              expect(result).toBeDefined();
              if (result) {
                await sleep(2000);
                watcheds = result.getWatched();
                result.close();
              }
            });

            describe('#02.02.01.02.02 => Watcheds', () => {
              describe('#02.02.01.02.02.01 => Folder', async () => {
                it('#02.02.01.02.02.01.01 => Only one folder', async () => {
                  expect(Object.keys(watcheds)).toHaveLength(1);
                });
                it('#02.02.01.02.02.01.02 => Has correct folder', async () => {
                  expect(watcheds).toHaveProperty(
                    'src/__tests__/fixtures/data',
                  );
                });
              });

              describe('#02.02.01.02.02.02 => Files', () => {
                it('#02.02.01.02.02.02.01 => Two files watched', () => {
                  expect(
                    watcheds['src/__tests__/fixtures/data'],
                  ).toHaveLength(2);
                });
                describe('#02.02.01.02.02.02.02 => Files', async () => {
                  it('#02.02.01.02.02.02.02.01 => Contains "config1"', async () => {
                    expect(
                      watcheds['src/__tests__/fixtures/data'],
                    ).toContain('config1.machine.ts');
                  });

                  it('#02.02.01.02.02.02.02.02 => Contains "config2"', async () => {
                    expect(
                      watcheds['src/__tests__/fixtures/data'],
                    ).toContain('config2.machine.ts');
                  });
                });
              });
            });
          });
        });

        test('#02.02.02.03 => console.warn', () => {
          expect(spy).toHaveBeenCalledTimes(4);
        });
      });

      describe('#02.02.02 => Strict mode', () => {
        describe('#02.02.02.01 => Not machine inside names', () => {
          const FILES = [
            'src/constants/numbers.ts',
            'src/constants/objects.ts',
          ];

          it('#02.02.02.01.01 => Result is defined', async () => {
            const result = await run(generateOne, [...FILES, '--strict']);
            expect(result).toBeUndefined();
          });

          describe('#02.02.02.02 => console.warn', () => {
            it('#02.02.02.01.01.03.01 => Has been called times 5', () => {
              expect(spy).toHaveBeenCalledTimes(5);
            });

            it('#02.02.02.01.01.03 => Has been called with "Strict, all machines names must ends with ".machine.ts"', () => {
              expect(spy).toHaveBeenNthCalledWith(
                5,
                'Strict, all machines names must ends with ".machine.ts"',
              );
            });
          });
        });

        describe('#02.02.02.02 => Machine inside names', () => {
          const { FILES, checkExistence } = usePrepare();

          let watcheds: any;

          checkExistence('#02.02.02.02.00', false);

          it('#02.02.02.02.01 => Result is defined', async () => {
            const result = await run(generateOne, FILES);
            expect(result).toBeDefined();
            if (result) {
              await sleep(200);
              watcheds = result.getWatched();
              result.close();
            }
          });

          describe('#02.02.02.02.02 => Watcheds', () => {
            describe('#02.02.02.02.02.01 => Folder', async () => {
              it('#02.02.02.02.02.01.01 => Only one folder', async () => {
                expect(Object.keys(watcheds)).toHaveLength(1);
              });

              it('#02.02.02.02.02.01.02 => Has correct folder', async () => {
                expect(watcheds).toHaveProperty(
                  'src/__tests__/fixtures/data',
                );
              });
            });

            describe('#02.02.02.02.02.02 => Files', () => {
              it('#02.02.02.02.02.02.01 => Only three files', () => {
                expect(
                  watcheds['src/__tests__/fixtures/data'],
                ).toHaveLength(3);
              });

              describe('#02.02.02.02.02.02.02 => Files', async () => {
                it('#02.02.02.02.02.02.02.01 => Contains "config1"', async () => {
                  expect(
                    watcheds['src/__tests__/fixtures/data'],
                  ).toContain('config1.machine.ts');
                });

                it('#02.02.02.02.02.02.02.02 => Contains "config2"', async () => {
                  expect(
                    watcheds['src/__tests__/fixtures/data'],
                  ).toContain('config2.machine.ts');
                });

                it('#02.02.02.02.02.02.02.03 => Contains "config3"', async () => {
                  expect(
                    watcheds['src/__tests__/fixtures/data'],
                  ).toContain('config3.machine.ts');
                });
              });
            });
          });

          checkExistence('#02.02.02.02.03', true);
        });

        it('#02.02.02.03 => Console.warn is not call inside this block', () => {
          expect(spy).toHaveBeenCalledTimes(5);
        });
      });
    });
  });
});
