import { defineConfig } from '@bemedev/rollup-config';

export default defineConfig.bemedev({
  declarationMap: true,
  ignoresJS: '**/*.example.ts',
  externals: ['@bemedev/app-ts/lib/states/functions/recompose.js'],
});
