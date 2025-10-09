export const BIN = 'app-typings';

export const DESCRIPTION =
  'Use it to generate type for libs "@bemedev/app-ts" and "@bemedev/fsf"';

export const EXTENSIONS = ['ts'] as const;

export const IDENTIFIERS = ['machine', 'function', 'logic'] as const;

export const LIBS = {
  function: {
    lib: '@bemedev/fsf',
    identitfier: [IDENTIFIERS[1], IDENTIFIERS[2]],
    matches: [
      `**/*.${IDENTIFIERS[1]}.${EXTENSIONS[0]}`,
      `**/*.${IDENTIFIERS[2]}.${EXTENSIONS[0]}`,
    ],
    function: 'createLogic',
  },
  machine: {
    lib: '@bemedev/app-ts',
    identitfier: IDENTIFIERS[0],
    matches: [`**/*.${IDENTIFIERS[0]}.${EXTENSIONS[0]}`],
    function: 'createMachine',
  },
} as const;

export const MATCHES = [
  ...LIBS.machine.matches,
  ...LIBS.function.matches,
] as const;

export const TEMPLATE_HEADER = `
 * 
 * ### Author
 *
 * chlbri (bri_lvi@icloud.com)
 *
 * [My GitHub](https://github.com/chlbri?tab=repositories)
 *
 * <br/>
 *
 * ### Documentation
 *
 * Link to machine lib [here](https://www.npmjs.com/package/@bemedev/app-ts).
 *
 * Link to this lib [here](https://www.npmjs.com/package/@bemedev/app-cli)
 *
 *
 * NB: This file is auto-generated. Do not edit manually.
`;
