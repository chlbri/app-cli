import { LIBS, PROJECT, TEMPLATE_HEADER } from '../../constants';
import { extractFromFile } from './file';
import {
  arrayToUnionString,
  buildPaths,
  extractAllPaths,
  generateTypesString,
} from '../helpers';

/**
 * Extracts the first parameter from the specified file.
 * @param filePath The path to the file from which to extract the parameter. It is relative to process.cwd
 * @returns The extracted parameter or undefined if not found.
 */
export const extractMachineVariables = (filePath: string) => {
  const all = extractFromFile(PROJECT, filePath);

  const hasImport = all.imports.some(
    ({ moduleSpecifier, namedImports }) => {
      return (
        moduleSpecifier === LIBS.machine.lib &&
        namedImports.includes(LIBS.machine.function)
      );
    },
  );

  if (!hasImport) {
    return console.warn('No relevant imports found.');
  }

  const variables = all.variables.filter(
    v => v.function === LIBS.machine.function,
  );

  const types: string[] = [
    `/**
 *
 * All paths of the concerned files
 ${TEMPLATE_HEADER}
 */`,
  ];

  types.push(
    buildPaths(
      ...variables.map(v => {
        const paths = arrayToUnionString(...extractAllPaths(v.params[0]));
        const variable = v.name;
        return { paths, variable };
      }),
    ),
  );

  const variables2 = variables.map(v => [v.name, v] as const);

  const variables3: typeof variables2 = [];
  variables2.forEach(([key1, value1]) => {
    const isInside = variables3.some(([key2]) => key1 === key2);
    if (!isInside) {
      const name = key1;
      variables3.push([name, { ...value1, name }]);
    } else {
      const name = `${key1}_1`;
      variables3.push([name, { ...value1, name }]);
    }
  });

  const variables4 = variables3.map(([, value]) => value);

  const schemas = [
    `/**
   * 
   * Constants as type helpers for the concerned file. 
   * Don't use it as values, just for typings
   ${TEMPLATE_HEADER}
   */
    export const SCHEMAS = {`,
    ...variables4.map(v => {
      const obj = v.params[0];
      const paths = extractAllPaths(obj);
      const variable = v.name;
      const str = generateTypesString(obj, paths, variable);

      const out = `${variable}: {
        __tsSchema: undefined as unknown as ${str},
      },`;
      return out;
    }),
    `}`,
  ];

  types.push(...schemas);

  return types.join('\n   ');
};
