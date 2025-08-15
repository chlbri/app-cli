import type {
  Config,
  ConfigDef,
  NoExtraKeysConfigDef,
} from '@bemedev/app-ts';
import { recomposeConfig } from '@bemedev/app-ts/lib/states/functions/recompose.js';
import { type NodeConfig } from '@bemedev/app-ts/lib/states/index.js';
import { flatByKey } from '@bemedev/decompose';

export const toSchema = (config: Config) => {
  const flat = flatByKey.low(config, 'states', {
    children: true,
    sep: '/',
  });

  const entries = Object.entries(flat);

  const out = entries
    .map(([key, value], _, all) => {
      const _value = value as NodeConfig;
      const { states: _states } = _value;
      let initial: string[] | undefined = undefined;
      if (_states) {
        if (_value.type !== 'parallel') initial = Object.keys(_states);
      }
      const targets = all.map(([key]) => key).filter(k => k !== key);
      const values = { initial, targets };
      return [key, values] as const;
    })
    .reduce((acc, [key, values]) => {
      acc[key] = values;
      return acc;
    }, {} as any);

  const recomposed = recomposeConfig(out);

  return recomposed as NoExtraKeysConfigDef<ConfigDef>;
};
