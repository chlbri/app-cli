# @bemedev/fsf - Final State Functions

> **Never use "if" again. Prototype, test, and code.**  
> _Inspired by XState, built for TypeScript_

## Table des matières

- [Introduction](#introduction)
- [Philosophie](#philosophie)
- [Installation](#installation)
- [Fonctionnalités](#fonctionnalités)
- [API Reference](#api-reference)
- [Guide d'utilisation](#guide-dutilisation)
- [Migration v1.0.0](#migration-v100)
- [Exemples avancés](#exemples-avancés)
- [Intégration dans app-cli](#intégration-dans-app-cli)
- [Ressources](#ressources)

---

## Introduction

`@bemedev/fsf` (Final State Functions) est une bibliothèque TypeScript pour
implémenter des machines à états synchrones sans utiliser de logique
conditionnelle (`if`/`else`/`switch`). Elle permet de modéliser le
comportement d'un système comme une séquence d'états et de transitions.

### Concept des machines à états

Une machine à états est un modèle mathématique représentant le comportement
d'un système à travers :

- **États** : Conditions spécifiques du système
- **Transitions** : Passages d'un état à un autre
- **Événements** : Déclencheurs de transitions
- **Actions** : Effets de bord lors des transitions
- **Guards** : Conditions de transition

## Philosophie

### Approche industrielle vs artisanale

La programmation traditionnelle utilise des structures conditionnelles
(`if`, `switch`) qui mélangent la logique métier et le flux de contrôle.
Les machines à états séparent ces préoccupations :

1. **Définition de la structure** : États et transitions
2. **Implémentation de la logique** : Actions et guards

### Différences avec XState

| Caractéristique              | @bemedev/fsf | XState        |
| ---------------------------- | ------------ | ------------- |
| Focus                        | Synchrone    | Sync + Async  |
| États imbriqués              | ❌           | ✅            |
| États parallèles             | ❌           | ✅            |
| Transitions différées        | ❌           | ✅            |
| Compatibilité Stately Editor | ✅           | ✅            |
| TypeScript natif             | ✅           | ✅            |
| Courbe d'apprentissage       | Plus simple  | Plus complexe |

## Installation

```bash
# npm
npm install @bemedev/fsf

# yarn
yarn add @bemedev/fsf

# pnpm (recommandé)
pnpm add @bemedev/fsf
```

## Fonctionnalités

| Fonctionnalité                   | Support |
| -------------------------------- | ------- |
| États finis                      | ✅      |
| État initial                     | ✅      |
| Transitions (objet)              | ✅      |
| Transitions (string target)      | ✅      |
| Transitions différées            | ❌      |
| Transitions sans événement       | ✅      |
| États imbriqués                  | ❌      |
| États parallèles                 | ❌      |
| États finaux                     | ✅      |
| Contexte                         | ✅      |
| Actions d'entrée                 | ✅      |
| Actions de sortie                | ✅      |
| Actions de transition            | ✅      |
| Actions paramétrées              | ✅      |
| Guards de transition             | ✅      |
| Guards paramétrés                | ✅      |
| Support asynchrone (via Promise) | ✅      |

## API Reference

### `createLogic<TContext, TEvents, TData>(config, types)`

Crée une instance de logique de machine à états.

#### Paramètres

**`config`** : Configuration de la machine

- `initial` (requis) : Nom de l'état initial
- `data` (requis) : Clé de la fonction de données par défaut ⚠️ _Breaking
  change v1.0.0_
- `states` (requis) : Définitions des états
- `context` (optionnel) : Valeur initiale du contexte

**`types`** : Définitions de types ⚠️ _Maintenant second argument en
v1.0.0_

- `context` : Type TypeScript du contexte
- `events` : Type TypeScript des événements
- `data` : Type TypeScript de la valeur de retour
- `promises` (optionnel) : Type TypeScript pour les promesses async

#### Retour

Instance de logique avec la méthode `provideOptions`

#### Exemple

```typescript
type Context = { count: number };
type Events = { type: 'INCREMENT' } | { type: 'DECREMENT' };
type Data = number;

const machine = createLogic(
  {
    initial: 'idle',
    data: 'defaultData', // Requis en v1.0.0+
    states: {
      idle: {
        on: {
          INCREMENT: { target: 'active', actions: 'increment' },
        },
      },
      active: { data: 'result' },
    },
  },
  {
    context: {} as Context,
    events: {} as Events,
    data: {} as Data,
  },
).provideOptions({
  actions: {
    increment: ctx => {
      ctx.count++;
    },
  },
  datas: {
    defaultData: ctx => ctx.count,
    result: ctx => ctx.count,
  },
});
```

### `.provideOptions(options)`

Fournit les implémentations d'options à une instance de logique.  
⚠️ _Breaking change v1.0.0_ : Les options ne sont plus le 3ème argument de
`createLogic`

#### Paramètres

- `actions` : Implémentations des fonctions d'action
- `guards` : Implémentations des fonctions de garde
- `datas` : Implémentations des fonctions de données (doit inclure la
  fonction correspondant à `config.data`)
- `promises` (optionnel) : Implémentations de promesses pour états async

#### Retour

Instance de logique configurée prête à être interprétée

#### Exemple

```typescript
const machine = createLogic(config, types).provideOptions({
  actions: {
    increment: ctx => {
      ctx.count++;
    },
  },
  guards: {
    isPositive: ctx => ctx.count > 0,
  },
  datas: {
    defaultData: ctx => ctx.count,
  },
});
```

### `interpret<TContext, TEvents, TData>(machine)`

Interprète une instance de logique et retourne une fonction exécutable.

#### Paramètres

- `machine` : Instance de logique créée avec `createLogic`

#### Retour

Fonction qui exécute la machine à états avec les événements donnés

#### Exemple

```typescript
const machine = createLogic(config, types).provideOptions(options);
const execute = interpret(machine);

const result = execute({ type: 'START' });
```

## Guide d'utilisation

### 1. Exemple basique : Compteur

```typescript
import { createLogic, interpret } from '@bemedev/fsf';

type Context = { count: number };
type Events = { type: 'INCREMENT' } | { type: 'DECREMENT' };
type Data = number;

const counterMachine = createLogic(
  {
    initial: 'idle',
    data: 'getCount',
    context: { count: 0 },
    states: {
      idle: {
        on: {
          INCREMENT: { target: 'incrementing', actions: 'increment' },
          DECREMENT: { target: 'decrementing', actions: 'decrement' },
        },
        data: 'getCount',
      },
      incrementing: {
        always: {
          target: 'idle',
        },
      },
      decrementing: {
        always: {
          target: 'idle',
        },
      },
    },
  },
  {
    context: {} as Context,
    events: {} as Events,
    data: {} as Data,
  },
).provideOptions({
  actions: {
    increment: ctx => {
      ctx.count++;
    },
    decrement: ctx => {
      ctx.count--;
    },
  },
  datas: {
    getCount: ctx => ctx.count,
  },
});

const counter = interpret(counterMachine);

console.log(counter({ type: 'INCREMENT' })); // 1
console.log(counter({ type: 'INCREMENT' })); // 2
console.log(counter({ type: 'DECREMENT' })); // 1
```

### 2. Guards (Logique conditionnelle)

```typescript
type Context = { value: number };
type Events = { type: 'CHECK'; value: number };
type Data = string;

const validationMachine = createLogic(
  {
    initial: 'idle',
    data: 'status',
    context: { value: 0 },
    states: {
      idle: {
        on: {
          CHECK: [
            { target: 'valid', cond: 'isPositive', actions: 'setValue' },
            { target: 'invalid', actions: 'setValue' },
          ],
        },
      },
      valid: { data: 'successMessage' },
      invalid: { data: 'errorMessage' },
    },
  },
  {
    context: {} as Context,
    events: {} as Events,
    data: {} as Data,
  },
).provideOptions({
  actions: {
    setValue: (ctx, event) => {
      ctx.value = event.value;
    },
  },
  guards: {
    isPositive: (ctx, event) => event.value > 0,
  },
  datas: {
    status: ctx => (ctx.value > 0 ? 'valid' : 'invalid'),
    successMessage: () => 'Valeur valide',
    errorMessage: () => 'Valeur invalide',
  },
});
```

### 3. Actions d'entrée et de sortie

```typescript
type Context = { logs: string[] };
type Events = { type: 'START' } | { type: 'STOP' };
type Data = string[];

const loggingMachine = createLogic(
  {
    initial: 'idle',
    data: 'getLogs',
    context: { logs: [] },
    states: {
      idle: {
        entry: 'logEntry',
        exit: 'logExit',
        on: {
          START: 'running',
        },
      },
      running: {
        entry: 'logRunning',
        on: {
          STOP: 'idle',
        },
        data: 'getLogs',
      },
    },
  },
  {
    context: {} as Context,
    events: {} as Events,
    data: {} as Data,
  },
).provideOptions({
  actions: {
    logEntry: ctx => {
      ctx.logs.push('Entering idle');
    },
    logExit: ctx => {
      ctx.logs.push('Exiting idle');
    },
    logRunning: ctx => {
      ctx.logs.push('Running');
    },
  },
  datas: {
    getLogs: ctx => ctx.logs,
  },
});
```

### 4. Transitions automatiques (always)

```typescript
type Context = { ready: boolean; result: string };
type Events = null;
type Data = string;

const autoMachine = createLogic(
  {
    initial: 'check',
    data: 'output',
    context: { ready: false, result: '' },
    states: {
      check: {
        always: [
          {
            target: 'success',
            cond: 'isReady',
            actions: 'setSuccessResult',
          },
          { target: 'waiting', actions: 'setWaitingResult' },
        ],
      },
      success: { data: 'output' },
      waiting: { data: 'output' },
    },
  },
  {
    context: {} as Context,
    events: {} as Events,
    data: {} as Data,
  },
).provideOptions({
  actions: {
    setSuccessResult: ctx => {
      ctx.result = 'Prêt !';
    },
    setWaitingResult: ctx => {
      ctx.result = 'En attente...';
    },
  },
  guards: {
    isReady: ctx => ctx.ready === true,
  },
  datas: {
    output: ctx => ctx.result,
  },
});
```

## Migration v1.0.0

### Breaking Changes

La version 1.0.0 introduit des changements majeurs :

1. **`data` requis** au niveau de la configuration
2. **Signature de `createLogic`** : Schema en second argument
3. **Options via `provideOptions`** au lieu du 3ème argument

### Ancienne API (v0.x)

```typescript
const machine = createLogic(
  {
    schema: {
      context: {} as Context,
      events: {} as Events,
      data: {} as string,
    },
    initial: 'idle',
    states: {
      done: { data: 'result' },
    },
  },
  {
    // Options ici (3ème argument)
    datas: {
      result: () => 'success',
    },
  },
);
```

### Nouvelle API (v1.0.0+)

```typescript
const machine = createLogic(
  {
    initial: 'idle',
    data: 'defaultData', // ← Maintenant requis
    states: {
      idle: { always: 'done' },
      done: { data: 'result' },
    },
  },
  {
    // Schema maintenant en second argument
    context: {} as Context,
    events: {} as Events,
    data: {} as Data,
  },
).provideOptions({
  // Options via provideOptions
  datas: {
    defaultData: () => 'default', // ← Doit fournir la fonction correspondante
    result: () => 'success',
  },
});
```

### Raisons des changements

1. **`data` requis** : Garantit que les machines ont toujours une valeur de
   retour par défaut
2. **Séparation schema/config** : Meilleure séparation des préoccupations
3. **`provideOptions`** : Permet une meilleure composition et un binding
   tardif

## Exemples avancés

### Query Builder HTTP

Exemple complet de construction de requête API avec catégories et produits
:

```typescript
import { createLogic, interpret } from '@bemedev/fsf';

type Context = {
  apiKey?: string;
  apiUrl?: string;
  url?: string;
};

type Events = { products?: string[]; categories?: string[] };

const queryMachine = createLogic(
  {
    context: {},
    initial: 'preferences',
    data: 'query',
    states: {
      preferences: {
        always: {
          actions: ['setUrl', 'setApiKey', 'startUrl'],
          target: 'categories',
        },
      },
      categories: {
        always: [
          {
            cond: 'hasCategories',
            target: 'products',
            actions: 'setCategories',
          },
          'products',
        ],
      },
      products: {
        always: [
          {
            cond: 'hasProducts',
            target: 'final',
            actions: 'setProducts',
          },
          'final',
        ],
      },
      final: {
        data: 'query',
      },
    },
  },
  {
    context: {} as Context,
    events: {} as Events | null,
    data: {} as string,
  },
).provideOptions({
  actions: {
    setApiKey: ctx => {
      ctx.apiKey = '123';
    },
    setUrl: ctx => {
      ctx.apiUrl = 'https://example.com';
    },
    startUrl: ctx => {
      const { apiUrl, apiKey } = ctx;
      ctx.url = `${apiUrl}?apikey=${apiKey}`;
    },
    setCategories: (ctx, { categories }) => {
      const _categories = categories?.join(',');
      ctx.url += `&categories=${_categories}`;
    },
    setProducts: (ctx, { products }) => {
      const _products = products?.join(',');
      ctx.url += `&products=${_products}`;
    },
  },
  guards: {
    hasCategories: (_, { categories }) =>
      !!categories && categories.length > 0,
    hasProducts: (_, { products }) => !!products && products.length > 0,
  },
  datas: {
    query: ctx => ctx.url,
  },
});

const buildQuery = interpret(queryMachine);

// Utilisation
console.log(buildQuery()); // https://example.com?apikey=123
console.log(buildQuery({ categories: ['a', 'b'] }));
// https://example.com?apikey=123&categories=a,b
console.log(buildQuery({ products: ['x', 'y'], categories: ['c', 'd'] }));
// https://example.com?apikey=123&categories=c,d&products=x,y
```

## Intégration dans app-cli

### Utilisation actuelle

Dans `app-cli`, `@bemedev/fsf` est utilisé comme **peerDependency** et
**devDependency** pour :

1. **Type checking** : Validation de schémas de machines à états
2. **Testing** : Tests unitaires de logiques métier
3. **Parsing** : Extraction de configurations de machines depuis le code
   source

### Exemple d'intégration

```typescript
// src/functions/extractFromFile.ts
import { createLogic } from '@bemedev/fsf';

// La fonction peut extraire et valider des machines fsf
const machine = createLogic(
  {
    initial: 'parsing',
    data: 'result',
    states: {
      parsing: {
        always: [
          { target: 'success', cond: 'isValid' },
          { target: 'error' },
        ],
      },
      success: { data: 'result' },
      error: { data: 'error' },
    },
  },
  {
    context: {} as ParsingContext,
    events: {} as ParsingEvents,
    data: {} as string,
  },
);
```

### Patterns recommandés

1. **Validation de configuration** : Utiliser fsf pour valider les inputs
   CLI
2. **Orchestration de scripts** : Gérer l'exécution séquentielle de tâches
3. **Gestion d'état** : Tracker l'état des dépendances et rollbacks

## Ressources

### Documentation officielle

- [Repository GitHub](https://github.com/chlbri/fsf)
- [Package npm](https://www.npmjs.com/package/@bemedev/fsf)
- [Yarn Package](https://classic.yarnpkg.com/en/package/@bemedev/fsf)

### Outils compatibles

- [Stately Editor](https://stately.ai/registry/discover) : Éditeur visuel
  de machines à états
- [XState Documentation](https://xstate.js.org/docs/) : Inspiration
  originale

### Conventions de commit

Lors de contributions, suivre les
[conventions de commit du projet](../.github/copilot-instructions.md).

### Développement

```bash
# Cloner le repository
git clone https://github.com/chlbri/fsf.git

# Installer les dépendances
pnpm install

# Lancer les tests
pnpm test

# Build
pnpm build
```

---

## License

MIT © [chlbri](https://github.com/chlbri) (bri_lvi@icloud.com)

## Support TypeScript

✅ **100% TypeScript** avec inférence de types complète  
✅ **Sécurité des types** garantie pour Context, Events, et Data  
✅ **Autocomplétion IDE** pour toutes les API

---

_Dernière mise à jour : Octobre 2025_
