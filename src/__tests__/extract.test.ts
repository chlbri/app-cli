import { flatByKey } from '@bemedev/decompose';
import { writeFileSync } from 'fs';
import { extractParam } from '../functions/extractParam';
import { generate } from '../functions/generate';
import { arrayToUnionString } from '../functions/helpers';
import { recomposeConfig } from '../functions/recomposeConfig';
import { stateType } from '../functions/stateType';

describe('extractFromFile', () => {
  test('file: states.ts', () => {
    const result = extractParam('src/__tests__/fixtures/config3.ts');

    // console.log('param', '=>', JSON.stringify(result, null, 2));

    const _flat = flatByKey(result, 'states', {
      children: true,
      sep: '/',
    });

    // console.log('_flat', '=>', JSON.stringify(_flat, null, 2));

    const keys = Object.keys(_flat);
    // console.log('keys', '=>', keys);

    const entries = Object.entries(_flat);
    const result1 = entries
      .map(([key, _value]) => {
        const _targets = keys.filter(k => k !== key);
        const targets = arrayToUnionString(..._targets);
        const value = { ..._value, targets };

        const isCompound = stateType(value) == 'compound';
        if (isCompound) {
          const keys = Object.keys(value.states);
          value.initial = arrayToUnionString(...keys);
        }

        return [key, value] as const;
      })
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {} as any);

    const result2 = recomposeConfig(result1);

    // console.log('result2', '=>', JSON.stringify(result2, null, 2));

    const result3 = generate(result2 as any);

    console.log('result3', '=>', JSON.stringify(result3, null, 2));

    writeFileSync('src/__tests__/fixtures/config3.generated.ts', result3);
  });
});
