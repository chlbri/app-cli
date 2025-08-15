import type { ConfigDef, NoExtraKeysConfigDef } from '@bemedev/app-ts';
import type { RecordS } from '@bemedev/app-ts/lib/types/index.js';
import { writeFile } from 'fs/promises';

export const writeGen = (
  file: string,
  values: RecordS<NoExtraKeysConfigDef<ConfigDef>>,
) => {
  const object = JSON.stringify(values, null, 2);

  const toWrite = `
  /**
   * This file is auto-generated. Do not edit manually.
   */

  export const __tsSchemas = ${object} as const;
  `;

  return writeFile(file, toWrite);
};
