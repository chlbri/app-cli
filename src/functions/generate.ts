// import { glob } from 'node:fs/promises';
import { extractVariables } from './extractVariables';
import { withoutExtension } from './helpers';
import { writeGen } from './writeGen';

export const generate = (filePath: string) => {
  const variables = extractVariables(filePath);

  if (!variables) {
    return console.warn('No machine variables found in', filePath);
  }

  const { file, extension } = withoutExtension(filePath);
  const fileToGen = `${file}.gen${extension}`;

  return writeGen(fileToGen, variables);
};
