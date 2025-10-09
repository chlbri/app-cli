import { extendType, string } from 'cmd-ts';
import * as v from 'valibot';
import { Path } from '../schemas';

export const path = extendType(string, {
  from: value => v.parseAsync(Path, value),
  description: 'A valid file path',
});
