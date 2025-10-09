// import { glob } from 'node:fs/promises';
import type { Path } from '../schemas';
import { extractFunctionVariables } from './extract/function';
import { extractMachineVariables } from './extract/machine';
import { withoutExtension } from './helpers';
import { writeGen } from './writeGen';

export const generateMachine = (filePath: Path) => {
  const variables = extractMachineVariables(filePath);

  if (!variables) {
    return console.warn('No machine variables found in', filePath);
  }

  const { file, extension } = withoutExtension(filePath);
  const fileToGen = `${file}.gen${extension}`;

  return writeGen(fileToGen, variables);
};

export const generateFunction = (filePath: Path) => {
  const variables = extractFunctionVariables(filePath);

  if (!variables) {
    return console.warn('No function variables found in', filePath);
  }

  const { file, extension } = withoutExtension(filePath);
  const fileToGen = `${file}.gen${extension}`;

  return writeGen(fileToGen, variables);
};

export const generate = (filePath: Path) => {
  const isMachine = filePath.endsWith('.machine.ts');
  return isMachine
    ? generateMachine(filePath)
    : generateFunction(filePath);
};
