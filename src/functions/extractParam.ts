import { PROJECT } from '../project';
import { extractFromFile } from './extractFromFile';

export const extractParam = (filePath: string) => {
  const all = extractFromFile(PROJECT, filePath);

  return all.variables[0].params[0];
};
