import { writeFileSync } from 'fs';

//TODO : Add other types, (eg. A sophisticated new createMachine type)
/**
 * Writes the generated code to the specified file.
 *
 * @param file  The file path to write the generated code to
 * @param values The values to include in the generated code
 * @returns Write the generated code to the specified file
 *

 */
export const writeGen = (file: string, values: string) =>
  writeFileSync(file, values, { flag: 'w' });
