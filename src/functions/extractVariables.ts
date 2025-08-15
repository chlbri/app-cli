import { PROJECT } from '../constants';
import { extractFromFile } from './extractFromFile';
import { toSchema } from './toSchema';

/**
 * Extracts the first parameter from the specified file.
 * @param filePath The path to the file from which to extract the parameter. It is relative to process.cwd
 * @returns The extracted parameter or undefined if not found.
 */
export const extractVariables = (filePath: string) => {
  const all = extractFromFile(PROJECT, filePath);

  const hasImport = all.imports.some(
    ({ moduleSpecifier, namedImports }) => {
      return (
        moduleSpecifier === '@bemedev/app-ts' &&
        namedImports.includes('createMachine')
      );
    },
  );

  if (!hasImport) {
    return console.warn('No relevant imports found.');
  }

  const out = all.variables
    .filter(v => v.function === 'createMachine')
    .map(v => [v.name, toSchema(v.params[0])] as const);

  const out2: typeof out = [];

  out.forEach(([key1, value1]) => {
    const isInside = out2.some(([key2]) => key1 === key2);
    if (!isInside) {
      out2.push([key1, value1]);
    } else {
      const _key = `${key1}_1`;
      out2.push([_key, value1]);
    }
  });

  return Object.fromEntries(out2);
};
