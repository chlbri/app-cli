import { glob } from 'node:fs/promises';
import { MATCHES } from '../constants';
import { extractVariables } from './extractVariables';
import { withoutExtension } from './helpers';
import { writeGen } from './writeGen';

export const generateOne = (filePath: string) => {
  const variables = extractVariables(filePath);

  if (!variables) {
    return console.warn('No machine variables found in', filePath);
  }

  const { file, extension } = withoutExtension(filePath);
  const fileToGen = `${file}.gen${extension}`;

  return writeGen(fileToGen, variables);
};

export const generate = async () => {
  const GLOB = await Array.fromAsync(glob(MATCHES));

  const all = GLOB.map(file => {
    const out = () => generateOne(file);
    return out;
  });

  return Promise.all(all.map(fn => fn()));
};
