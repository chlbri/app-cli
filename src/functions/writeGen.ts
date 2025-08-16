import type { ConfigDef, NoExtraKeysConfigDef } from '@bemedev/app-ts';
import type { RecordS } from '@bemedev/app-ts/lib/types/index.js';
import { writeFileSync } from 'fs';

//TODO : Add other types, (eg. A sophisticated new createMachine type)
/**
 * Writes the generated code to the specified file.
 *
 * @param file  The file path to write the generated code to
 * @param values The values to include in the generated code
 * @returns Write the generated code to the specified file
 *
 * @see {@linkcode RecordS}
 * @see {@linkcode NoExtraKeysConfigDef}
 * @see {@linkcode ConfigDef}
 */
export const writeGen = (
  file: string,
  values: RecordS<NoExtraKeysConfigDef<ConfigDef>>,
) => {
  const object = JSON.stringify(values, null, 2);

  const toWrite = `


  /**
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
   * This file is auto-generated. Do not edit manually.
   */
  export const __tsSchemas = {} as ${object};
  `;

  return writeFileSync(file, toWrite, { flag: 'w' });
};
