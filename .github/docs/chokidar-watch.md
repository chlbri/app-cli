# Utiliser `watch` de chokidar

Ce document explique l’usage de l’API `watch` de
[chokidar](https://github.com/paulmillr/chokidar) (v4), avec des exemples
adaptés à ce repo.

```ts
import { watch } from 'chokidar';
```

Note v4: le support des globs a été retiré; passez plutôt des chemins
concrets (string ou array), ou précalculez via `node:fs/promises` `glob()`
puis `Array.fromAsync` (comme dans `src/cli/generate.ts`).

## Signature

- `watch(paths: string | string[], options?: WatchOptions): FSWatcher`
- `FSWatcher` expose `.on(event, cb)`, `.add()`, `.unwatch()`,
  `.getWatched()`, `.close()` (async).

## Options clés (défauts v4)

- `persistent` (def: `true`): garde le process vivant tant que des fichiers
  sont surveillés.
- Filtrage:
  - `ignored`: fonction, RegExp ou chemin. Teste le chemin entier.
  - `ignoreInitial` (def: `false`): si `false`, émet aussi `add/addDir`
    pendant le scan initial.
  - `followSymlinks` (def: `true`).
  - `cwd` (sans défaut): base pour relativiser les chemins émis.
- Performance:
  - `usePolling` (def: `false`): active le backend poll (utile sur NFS).
  - `interval` (def: `100` ms), `binaryInterval` (def: `300` ms) quand
    `usePolling: true`.
  - `alwaysStat` (def: `false`): force la dispo de `fs.Stats` dans
    `add/addDir/change`.
  - `depth` (def: `undefined`): limite la profondeur de récursion.
  - `awaitWriteFinish` (def: `false` ou
    `{ stabilityThreshold: 2000, pollInterval: 100 }` quand objet): retarde
    `add/change` jusqu’à fin d’écriture.
- Erreurs:
  - `ignorePermissionErrors` (def: `false`).
  - `atomic` (def: `true` quand non-polling): convertit des séquences
    atomiques en `change`.

## Événements

- Fichiers: `add`, `change`, `unlink`
- Dossiers: `addDir`, `unlinkDir`
- Spéciaux: `ready` (scan initial fini), `error`, `raw` (interne), `all`
  (événement + chemin pour tous sauf `ready/raw/error`).

## Exemples pratiques

### 1) Watch une liste de fichiers

```ts
import { watch } from 'chokidar';

const files = ['src/a.ts', 'src/b.ts'];
const watcher = watch(files)
  .on('all', (event, file) => console.log(event, file))
  .on('change', file => console.log(`Changed: ${file}`));

// Arrêt (async)
await watcher.close();
```

### 2) Pré-calcul via glob Node (remplace globs v3)

```ts
import { glob } from 'node:fs/promises';
import { watch } from 'chokidar';

const FILES = await Array.fromAsync(glob('src/**/*.{ts,tsx}'));
const watcher = watch(FILES)
  .on('add', f => console.log('File added:', f))
  .on('change', f => console.log('File changed:', f))
  .on('unlink', f => console.log('File removed:', f));
```

### 3) Ignorer tout sauf .ts en fonction

```ts
const watcher = watch(['src'], {
  ignored: (path, stats) => stats?.isFile() && !path.endsWith('.ts'),
  alwaysStat: true,
});
```

### 4) Attendre la fin d’écriture et tuer proprement

```ts
const watcher = watch(await Array.fromAsync(glob('src/**/*')), {
  awaitWriteFinish: { stabilityThreshold: 1500, pollInterval: 100 },
});

process.on('SIGINT', async () => {
  await watcher.close();
  process.exit(0);
});
```

### 5) Unwatch dynamique

```ts
const watcher = watch(await Array.fromAsync(glob('src/**/*'))).on(
  'unlink',
  file => {
    console.log('Removed:', file);
    void watcher.unwatch(file);
  },
);
```

## Intégration avec `src/cli/generate.ts`

Le pattern recommandé depuis v4 est utilisé dans ton fichier:

```ts
const FILES = await Array.fromAsync(glob(MATCHES));
const watcher = watch(FILES)
  .on('all', (_, file) => generateOne(file))
  .on('add', file => console.log(`File added: ${file}`))
  .on('change', file => console.log(`File changed: ${file}`))
  .on('unlink', file => {
    console.log(`File removed: ${file}`);
    watcher.unwatch(file);
  });
```

Astuces:

- Si tu veux relancer sur un set plus large, préfère recalculer `FILES`
  puis `watcher.add(newFiles)`.
- Utilise `awaitWriteFinish` pour éviter les builds sur fichiers partiels.
- `close()` est async: utilise `await` dans les hooks de shutdown.

## Références

- README: https://github.com/paulmillr/chokidar
- npm: https://www.npmjs.com/package/chokidar
