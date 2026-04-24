# Valibot - La bibliothèque de validation modulaire

> **Bibliothèque de schémas modulaire et type-safe pour valider des données
> structurées 🤖**  
> _Bundle size < 1 KB • Alternative à Zod avec 94% de réduction de taille_

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![NPM version](https://img.shields.io/npm/v/valibot.svg)](https://npmjs.org/package/valibot)
[![Downloads](https://img.shields.io/npm/dw/valibot)](https://npmjs.org/package/valibot)

## Table des matières

- [Introduction](#introduction)
- [Philosophie](#philosophie)
- [Installation](#installation)
- [Points forts](#points-forts)
- [Concepts de base](#concepts-de-base)
- [API Reference](#api-reference)
- [Guide d'utilisation](#guide-dutilisation)
- [Comparaison avec Zod](#comparaison-avec-zod)
- [Cas d'usage](#cas-dusage)
- [Exemples avancés](#exemples-avancés)
- [Intégration dans app-cli](#intégration-dans-app-cli)
- [Performance & Bundle Size](#performance--bundle-size)
- [Ressources](#ressources)

---

## Introduction

**Valibot** est une bibliothèque de validation de schémas TypeScript créée
par [Fabian Hiller](https://github.com/fabian-hiller) dans le cadre de sa
thèse de bachelor à la Stuttgart Media University, supervisée par Walter
Kriha, [Miško Hevery](https://github.com/mhevery) (créateur d'Angular) et
[Ryan Carniato](https://github.com/ryansolid) (créateur de SolidJS).

### Qu'est-ce qu'un schéma ?

Un schéma peut être comparé à une définition de type TypeScript. La grande
différence est que :

- **Types TypeScript** : Ne sont pas exécutés, feature de DX uniquement
- **Schémas Valibot** : Peuvent être exécutés à runtime pour garantir la
  sécurité des types de données inconnues

### Pourquoi Valibot ?

Valibot aide à **valider des données** facilement en utilisant un schéma,
peu importe qu'il s'agisse de :

- Données entrantes sur un serveur
- Données de formulaire
- Fichiers de configuration
- Variables d'environnement
- Réponses API

La bibliothèque n'a **aucune dépendance** et peut être exécutée dans
**n'importe quel environnement JavaScript**.

## Philosophie

### Design modulaire vs monolithique

Au lieu de s'appuyer sur quelques grandes fonctions avec de nombreuses
méthodes, le design de l'API et le code source de Valibot sont basés sur
**de nombreuses petites fonctions indépendantes**, chacune avec une seule
tâche.

#### Avantages du design modulaire

1. **Tree-shaking optimal** : Le bundler peut supprimer tout code non
   utilisé
2. **Extension facile** : Ajout de fonctionnalités externes sans friction
3. **Code plus robuste** : Tests unitaires plus faciles et précis
4. **Bundle size réduit** : Jusqu'à 95% de réduction vs Zod
5. **Maintenabilité** : Code source bien structuré et commenté

### Inspiration et crédits

- **Zod** : API design inspiré par Colin McDonnell
- **XState** : Approche modulaire et type-safe
- Supervisé par Miško Hevery (Angular) et Ryan Carniato (SolidJS)

## Installation

```bash
# npm
npm install valibot

# yarn
yarn add valibot

# pnpm (recommandé)
pnpm add valibot
```

## Points forts

| Caractéristique                                  | ✅  |
| ------------------------------------------------ | --- |
| **Type safety** complet avec inférence statique  | ✅  |
| **Bundle size** minimal (< 700 bytes de départ)  | ✅  |
| **Validation** de strings à objets complexes     | ✅  |
| **Open source** avec 100% de couverture de tests | ✅  |
| **Actions** de transformation et validation      | ✅  |
| **Code source** structuré sans dépendances       | ✅  |
| **API** minimale, lisible et bien pensée         | ✅  |

## Concepts de base

### 1. Créer un schéma

Un schéma décrit un ensemble de données structurées :

```typescript
import * as v from 'valibot';

// Schéma simple de string
const EmailSchema = v.pipe(v.string(), v.email());

// Schéma d'objet complexe
const UserSchema = v.object({
  name: v.string(),
  age: v.pipe(v.number(), v.minValue(18)),
  email: v.pipe(v.string(), v.email()),
});
```

### 2. Inférer le type TypeScript

Valibot permet d'inférer automatiquement le type TypeScript :

```typescript
import * as v from 'valibot';

const LoginSchema = v.object({
  email: v.pipe(v.string(), v.email()),
  password: v.pipe(v.string(), v.minLength(8)),
});

// Inférer le type de sortie
type LoginData = v.InferOutput<typeof LoginSchema>;
// { email: string; password: string }

// Inférer le type d'entrée (avant transformation)
type LoginInput = v.InferInput<typeof LoginSchema>;
```

> **Note** : L'input et l'output diffèrent seulement si vous utilisez
> `transform` pour transformer les données après validation.

### 3. Parser des données

Trois méthodes principales pour valider les données :

#### `parse()` - Lance une exception

```typescript
import * as v from 'valibot';

const LoginSchema = v.object({
  email: v.pipe(v.string(), v.email()),
  password: v.pipe(v.string(), v.minLength(8)),
});

// ❌ Lance une erreur
v.parse(LoginSchema, { email: '', password: '' });

// ✅ Retourne les données typées
const data = v.parse(LoginSchema, {
  email: 'jane@example.com',
  password: '12345678',
});
```

#### `safeParse()` - Retourne un résultat

```typescript
const result = v.safeParse(LoginSchema, data);

if (result.success) {
  console.log(result.output); // Données validées
} else {
  console.error(result.issues); // Erreurs de validation
}
```

#### `is()` - Type guard

```typescript
if (v.is(LoginSchema, data)) {
  // data est typé comme LoginData
  console.log(data.email);
}
```

## API Reference

### Schémas primitifs

| Fonction       | Description              | Exemple                  |
| -------------- | ------------------------ | ------------------------ |
| `string()`     | Valide une string        | `v.string()`             |
| `number()`     | Valide un number         | `v.number()`             |
| `boolean()`    | Valide un boolean        | `v.boolean()`            |
| `bigint()`     | Valide un bigint         | `v.bigint()`             |
| `date()`       | Valide une Date          | `v.date()`               |
| `null_()`      | Valide null              | `v.null_()`              |
| `undefined_()` | Valide undefined         | `v.undefined_()`         |
| `any()`        | Accepte n'importe quoi   | `v.any()`                |
| `unknown()`    | Type unknown (plus sûr)  | `v.unknown()`            |
| `literal()`    | Valide une valeur exacte | `v.literal('admin')`     |
| `symbol()`     | Valide un Symbol         | `v.symbol()`             |
| `blob()`       | Valide un Blob           | `v.blob()`               |
| `custom()`     | Validation personnalisée | `v.custom((v) => {...})` |

### Schémas complexes

| Fonction      | Description                    | Exemple                                        |
| ------------- | ------------------------------ | ---------------------------------------------- |
| `object()`    | Objet avec propriétés          | `v.object({ name: v.string() })`               |
| `array()`     | Tableau d'éléments             | `v.array(v.string())`                          |
| `tuple()`     | Tableau avec types fixes       | `v.tuple([v.string(), v.number()])`            |
| `record()`    | Objet avec clés dynamiques     | `v.record(v.string(), v.number())`             |
| `map()`       | Valide une Map                 | `v.map(v.string(), v.number())`                |
| `set()`       | Valide un Set                  | `v.set(v.string())`                            |
| `enum_()`     | Valide une enum TypeScript     | `v.enum_(MyEnum)`                              |
| `picklist()`  | Valide une valeur d'une liste  | `v.picklist(['admin', 'user'])`                |
| `union()`     | Union de plusieurs schémas     | `v.union([v.string(), v.number()])`            |
| `variant()`   | Union discriminée              | `v.variant('type', [schema1, schema2])`        |
| `intersect()` | Intersection de schémas        | `v.intersect([schema1, schema2])`              |
| `lazy()`      | Schéma récursif (lazy loading) | `v.lazy(() => v.object({ self: NodeSchema }))` |

### Actions de validation

| Fonction         | Description                       | Exemple                                                  |
| ---------------- | --------------------------------- | -------------------------------------------------------- |
| `email()`        | Valide un email                   | `v.pipe(v.string(), v.email())`                          |
| `url()`          | Valide une URL                    | `v.pipe(v.string(), v.url())`                            |
| `emoji()`        | Valide un emoji                   | `v.pipe(v.string(), v.emoji())`                          |
| `uuid()`         | Valide un UUID                    | `v.pipe(v.string(), v.uuid())`                           |
| `ip()`           | Valide une adresse IP             | `v.pipe(v.string(), v.ip())`                             |
| `ipv4()`         | Valide une adresse IPv4           | `v.pipe(v.string(), v.ipv4())`                           |
| `ipv6()`         | Valide une adresse IPv6           | `v.pipe(v.string(), v.ipv6())`                           |
| `isoDate()`      | Valide une date ISO               | `v.pipe(v.string(), v.isoDate())`                        |
| `isoDateTime()`  | Valide une date-time ISO          | `v.pipe(v.string(), v.isoDateTime())`                    |
| `isoTimestamp()` | Valide un timestamp ISO           | `v.pipe(v.string(), v.isoTimestamp())`                   |
| `regex()`        | Valide avec une regex             | `v.pipe(v.string(), v.regex(/^\d+$/))`                   |
| `minLength()`    | Longueur minimale                 | `v.pipe(v.string(), v.minLength(8))`                     |
| `maxLength()`    | Longueur maximale                 | `v.pipe(v.string(), v.maxLength(100))`                   |
| `length()`       | Longueur exacte                   | `v.pipe(v.string(), v.length(10))`                       |
| `minValue()`     | Valeur minimale                   | `v.pipe(v.number(), v.minValue(0))`                      |
| `maxValue()`     | Valeur maximale                   | `v.pipe(v.number(), v.maxValue(100))`                    |
| `value()`        | Valeur exacte                     | `v.pipe(v.number(), v.value(42))`                        |
| `minSize()`      | Taille minimale (array, set, map) | `v.pipe(v.array(v.string()), v.minSize(1))`              |
| `maxSize()`      | Taille maximale (array, set, map) | `v.pipe(v.array(v.string()), v.maxSize(10))`             |
| `size()`         | Taille exacte (array, set, map)   | `v.pipe(v.array(v.string()), v.size(5))`                 |
| `includes()`     | Contient une valeur               | `v.pipe(v.string(), v.includes('test'))`                 |
| `startsWith()`   | Commence par                      | `v.pipe(v.string(), v.startsWith('http'))`               |
| `endsWith()`     | Termine par                       | `v.pipe(v.string(), v.endsWith('.com'))`                 |
| `integer()`      | Valide un entier                  | `v.pipe(v.number(), v.integer())`                        |
| `finite()`       | Valide un nombre fini             | `v.pipe(v.number(), v.finite())`                         |
| `safeInteger()`  | Valide un entier safe             | `v.pipe(v.number(), v.safeInteger())`                    |
| `custom()`       | Validation personnalisée          | `v.pipe(v.string(), v.custom((v) => v !== 'forbidden'))` |

### Actions de transformation

| Fonction        | Description                 | Exemple                                                   |
| --------------- | --------------------------- | --------------------------------------------------------- |
| `transform()`   | Transforme la valeur        | `v.pipe(v.string(), v.transform((s) => s.toUpperCase()))` |
| `toLowerCase()` | Convertit en minuscules     | `v.pipe(v.string(), v.toLowerCase())`                     |
| `toUpperCase()` | Convertit en majuscules     | `v.pipe(v.string(), v.toUpperCase())`                     |
| `trim()`        | Supprime espaces début/fin  | `v.pipe(v.string(), v.trim())`                            |
| `trimStart()`   | Supprime espaces au début   | `v.pipe(v.string(), v.trimStart())`                       |
| `trimEnd()`     | Supprime espaces à la fin   | `v.pipe(v.string(), v.trimEnd())`                         |
| `toMinValue()`  | Clamp à une valeur minimale | `v.pipe(v.number(), v.toMinValue(0))`                     |
| `toMaxValue()`  | Clamp à une valeur maximale | `v.pipe(v.number(), v.toMaxValue(100))`                   |

### Utilitaires TypeScript-like

| Fonction       | Description                         | Exemple                                     |
| -------------- | ----------------------------------- | ------------------------------------------- |
| `optional()`   | Rend le schéma optionnel            | `v.optional(v.string())`                    |
| `nullable()`   | Rend le schéma nullable             | `v.nullable(v.string())`                    |
| `nullish()`    | Rend le schéma null ou undefined    | `v.nullish(v.string())`                     |
| `partial()`    | Rend toutes propriétés optionnelles | `v.partial(v.object({ name: v.string() }))` |
| `required()`   | Rend toutes propriétés requises     | `v.required(schema)`                        |
| `pick()`       | Sélectionne des propriétés          | `v.pick(schema, ['name', 'email'])`         |
| `omit()`       | Exclut des propriétés               | `v.omit(schema, ['password'])`              |
| `merge()`      | Fusionne des objets                 | `v.merge([schema1, schema2])`               |
| `fallback()`   | Valeur par défaut en cas d'échec    | `v.fallback(v.string(), 'default')`         |
| `getDefault()` | Obtient la valeur par défaut        | `v.getDefault(schema)`                      |

## Guide d'utilisation

### 1. Validation de formulaire de login

```typescript
import * as v from 'valibot';

const LoginSchema = v.object({
  email: v.pipe(
    v.string('Email requis'),
    v.minLength(1, 'Email ne peut pas être vide'),
    v.email('Format email invalide'),
  ),
  password: v.pipe(
    v.string('Mot de passe requis'),
    v.minLength(1, 'Mot de passe ne peut pas être vide'),
    v.minLength(8, 'Mot de passe doit avoir 8 caractères minimum'),
  ),
});

// Utilisation
try {
  const data = v.parse(LoginSchema, {
    email: 'jane@example.com',
    password: '12345678',
  });
  // data est typé : { email: string; password: string }
} catch (error) {
  if (error instanceof v.ValiError) {
    console.error(error.issues);
  }
}
```

### 2. Validation avec transformation

```typescript
import * as v from 'valibot';

const UserSchema = v.object({
  name: v.pipe(v.string(), v.trim(), v.toLowerCase()),
  email: v.pipe(v.string(), v.email(), v.toLowerCase()),
  age: v.pipe(v.number(), v.minValue(18), v.maxValue(120)),
  role: v.optional(v.picklist(['admin', 'user']), 'user'), // Valeur par défaut
});

type User = v.InferOutput<typeof UserSchema>;
// {
//   name: string;
//   email: string;
//   age: number;
//   role?: 'admin' | 'user';
// }

const user = v.parse(UserSchema, {
  name: '  JOHN DOE  ',
  email: 'JOHN@EXAMPLE.COM',
  age: 25,
});
// {
//   name: 'john doe',
//   email: 'john@example.com',
//   age: 25,
//   role: 'user'
// }
```

### 3. Validation d'API Response

```typescript
import * as v from 'valibot';

const ApiResponseSchema = v.object({
  success: v.boolean(),
  data: v.optional(
    v.array(
      v.object({
        id: v.pipe(v.string(), v.uuid()),
        title: v.string(),
        createdAt: v.pipe(v.string(), v.isoDateTime()),
        tags: v.array(v.string()),
      }),
    ),
  ),
  error: v.optional(
    v.object({
      code: v.string(),
      message: v.string(),
    }),
  ),
});

async function fetchData() {
  const response = await fetch('/api/posts');
  const json = await response.json();

  // Validation sécurisée
  const result = v.safeParse(ApiResponseSchema, json);

  if (result.success) {
    return result.output.data;
  } else {
    throw new Error('Invalid API response');
  }
}
```

### 4. Union et variants (discriminated unions)

```typescript
import * as v from 'valibot';

// Union simple
const StringOrNumberSchema = v.union([v.string(), v.number()]);

type StringOrNumber = v.InferOutput<typeof StringOrNumberSchema>;
// string | number

// Variant (union discriminée) - Recommandé pour les performances
const NotificationSchema = v.variant('type', [
  v.object({
    type: v.literal('email'),
    email: v.pipe(v.string(), v.email()),
    subject: v.string(),
  }),
  v.object({
    type: v.literal('sms'),
    phoneNumber: v.string(),
    message: v.string(),
  }),
  v.object({
    type: v.literal('push'),
    deviceId: v.string(),
    title: v.string(),
    body: v.string(),
  }),
]);

type Notification = v.InferOutput<typeof NotificationSchema>;
// { type: 'email'; email: string; subject: string }
// | { type: 'sms'; phoneNumber: string; message: string }
// | { type: 'push'; deviceId: string; title: string; body: string }
```

### 5. Schémas récursifs

```typescript
import * as v from 'valibot';

type Node = {
  value: string;
  children?: Node[];
};

const NodeSchema: v.GenericSchema<Node> = v.object({
  value: v.string(),
  children: v.optional(v.lazy(() => v.array(NodeSchema))),
});

const tree = v.parse(NodeSchema, {
  value: 'root',
  children: [
    {
      value: 'child1',
      children: [{ value: 'grandchild' }],
    },
    { value: 'child2' },
  ],
});
```

### 6. Validation personnalisée

```typescript
import * as v from 'valibot';

const PasswordSchema = v.pipe(
  v.string(),
  v.minLength(8),
  v.custom(
    password => /[A-Z]/.test(password),
    'Doit contenir au moins une majuscule',
  ),
  v.custom(
    password => /[a-z]/.test(password),
    'Doit contenir au moins une minuscule',
  ),
  v.custom(
    password => /\d/.test(password),
    'Doit contenir au moins un chiffre',
  ),
  v.custom(
    password => /[!@#$%^&*]/.test(password),
    'Doit contenir au moins un caractère spécial',
  ),
);
```

### 7. Configuration d'environnement

```typescript
import * as v from 'valibot';

const EnvSchema = v.object({
  NODE_ENV: v.picklist(['development', 'production', 'test']),
  PORT: v.pipe(
    v.string(),
    v.transform(val => parseInt(val, 10)),
    v.number(),
    v.minValue(1),
    v.maxValue(65535),
  ),
  DATABASE_URL: v.pipe(v.string(), v.url()),
  API_KEY: v.pipe(v.string(), v.minLength(32)),
  DEBUG: v.optional(
    v.pipe(
      v.string(),
      v.transform(val => val === 'true'),
    ),
    false,
  ),
});

// Valider process.env au démarrage
const env = v.parse(EnvSchema, process.env);

export default env;
```

## Comparaison avec Zod

### Bundle Size

Pour un formulaire de login simple :

| Bibliothèque | Bundle Size | Réduction |
| ------------ | ----------- | --------- |
| **Valibot**  | 0.7 KB      | -         |
| Zod          | 11.51 KB    | -94%      |
| Yup          | ~30 KB      | -97%      |
| Joi          | ~145 KB     | -99.5%    |

### Syntaxe comparative

#### Zod

```typescript
import { object, string } from 'zod';

const LoginSchema = object({
  email: string().min(1, 'Email requis').email('Format email invalide'),
  password: string()
    .min(1, 'Mot de passe requis')
    .min(8, 'Minimum 8 caractères'),
});
```

#### Valibot

```typescript
import * as v from 'valibot';

const LoginSchema = v.object({
  email: v.pipe(
    v.string(),
    v.minLength(1, 'Email requis'),
    v.email('Format email invalide'),
  ),
  password: v.pipe(
    v.string(),
    v.minLength(1, 'Mot de passe requis'),
    v.minLength(8, 'Minimum 8 caractères'),
  ),
});
```

### Avantages de Valibot

✅ **Bundle size** : 94% plus petit pour cas simples  
✅ **Modularité** : Fonctions indépendantes, tree-shaking optimal  
✅ **Performance** : Code optimisé pour compression  
✅ **Extensibilité** : Ajout facile de validateurs personnalisés  
✅ **Tests** : 100% de couverture de code

### Quand utiliser Zod

- Écosystème mature avec beaucoup d'intégrations existantes
- Migration d'un projet existant utilisant Zod
- Bundle size n'est pas une contrainte critique

### Quand utiliser Valibot

- **Bundle size critique** (applications client-side)
- Nouvelles applications nécessitant validation de schémas
- Projets avec besoins de validation spécifiques/personnalisés
- Optimisation maximale des performances

## Cas d'usage

### 1. Validation de requêtes serveur

```typescript
import * as v from 'valibot';

const CreateUserSchema = v.object({
  username: v.pipe(v.string(), v.minLength(3), v.maxLength(20)),
  email: v.pipe(v.string(), v.email()),
  password: v.pipe(v.string(), v.minLength(8)),
  age: v.optional(v.pipe(v.number(), v.minValue(13))),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = v.parse(CreateUserSchema, body);

    // data est typé et validé
    await createUser(data);

    return Response.json({ success: true });
  } catch (error) {
    if (error instanceof v.ValiError) {
      return Response.json({ errors: error.issues }, { status: 400 });
    }
    throw error;
  }
}
```

### 2. Validation de formulaire (Next.js Server Actions)

```typescript
'use server';

import * as v from 'valibot';
import { loginUser } from '~/api';

const LoginSchema = v.object({
  email: v.pipe(v.string(), v.email()),
  password: v.pipe(v.string(), v.minLength(8)),
});

export async function login(formData: FormData) {
  try {
    const { email, password } = v.parse(
      LoginSchema,
      Object.fromEntries(formData.entries()),
    );

    await loginUser({ email, password });
    return { success: true };
  } catch (error) {
    if (error instanceof v.ValiError) {
      return { errors: error.issues };
    }
    return { error: 'Une erreur est survenue' };
  }
}
```

### 3. Validation de fichiers de configuration

```typescript
import * as v from 'valibot';
import fs from 'fs/promises';

const ConfigSchema = v.object({
  app: v.object({
    name: v.string(),
    version: v.pipe(v.string(), v.regex(/^\d+\.\d+\.\d+$/)),
  }),
  database: v.object({
    host: v.string(),
    port: v.pipe(v.number(), v.minValue(1), v.maxValue(65535)),
    name: v.string(),
    ssl: v.optional(v.boolean(), false),
  }),
  logging: v.object({
    level: v.picklist(['debug', 'info', 'warn', 'error']),
    format: v.picklist(['json', 'text']),
  }),
});

export async function loadConfig(path: string) {
  const content = await fs.readFile(path, 'utf-8');
  const json = JSON.parse(content);

  try {
    return v.parse(ConfigSchema, json);
  } catch (error) {
    if (error instanceof v.ValiError) {
      console.error('Configuration invalide:');
      error.issues.forEach(issue => {
        console.error(`  - ${issue.path?.join('.')}: ${issue.message}`);
      });
    }
    throw new Error('Impossible de charger la configuration');
  }
}
```

## Exemples avancés

### 1. Validation avec dépendances entre champs

```typescript
import * as v from 'valibot';

const BookingSchema = v.pipe(
  v.object({
    checkIn: v.pipe(v.string(), v.isoDate()),
    checkOut: v.pipe(v.string(), v.isoDate()),
    guests: v.pipe(v.number(), v.minValue(1), v.maxValue(10)),
    roomType: v.picklist(['single', 'double', 'suite']),
  }),
  v.custom(data => {
    const checkIn = new Date(data.checkIn);
    const checkOut = new Date(data.checkOut);
    return checkOut > checkIn;
  }, "Date de départ doit être après date d'arrivée"),
  v.custom(data => {
    if (data.roomType === 'single' && data.guests > 1) {
      return false;
    }
    return true;
  }, 'Chambre simple limitée à 1 personne'),
);
```

### 2. Validation de fichiers uploadés

```typescript
import * as v from 'valibot';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const FileUploadSchema = v.pipe(
  v.blob(),
  v.custom(
    file => file.size <= MAX_FILE_SIZE,
    'Fichier trop volumineux (max 5MB)',
  ),
  v.custom(
    file => ALLOWED_TYPES.includes(file.type),
    'Type de fichier non supporté (JPEG, PNG, WebP uniquement)',
  ),
);

const MultiFileUploadSchema = v.object({
  files: v.pipe(
    v.array(FileUploadSchema),
    v.minSize(1, 'Au moins un fichier requis'),
    v.maxSize(10, 'Maximum 10 fichiers'),
  ),
});
```

### 3. Validation asynchrone

```typescript
import * as v from 'valibot';

// Fonction async pour vérifier si email existe
async function emailExists(email: string): Promise<boolean> {
  const response = await fetch(`/api/check-email?email=${email}`);
  const { exists } = await response.json();
  return exists;
}

const RegisterSchema = v.pipeAsync(
  v.object({
    email: v.pipe(v.string(), v.email()),
    password: v.pipe(v.string(), v.minLength(8)),
  }),
  v.customAsync(async data => {
    const exists = await emailExists(data.email);
    return !exists;
  }, 'Email déjà utilisé'),
);

// Utilisation
const result = await v.safeParseAsync(RegisterSchema, formData);
```

### 4. Constructeur de query avec validation

```typescript
import * as v from 'valibot';

const QueryParamsSchema = v.object({
  page: v.optional(
    v.pipe(
      v.string(),
      v.transform(val => parseInt(val, 10)),
      v.number(),
      v.minValue(1),
    ),
    1,
  ),
  limit: v.optional(
    v.pipe(
      v.string(),
      v.transform(val => parseInt(val, 10)),
      v.number(),
      v.minValue(1),
      v.maxValue(100),
    ),
    10,
  ),
  sortBy: v.optional(
    v.picklist(['name', 'createdAt', 'updatedAt']),
    'createdAt',
  ),
  order: v.optional(v.picklist(['asc', 'desc']), 'desc'),
  search: v.optional(v.string()),
});

export function buildQuery(params: URLSearchParams) {
  const parsed = v.parse(
    QueryParamsSchema,
    Object.fromEntries(params.entries()),
  );

  // parsed est typé et validé
  return {
    skip: (parsed.page - 1) * parsed.limit,
    take: parsed.limit,
    orderBy: { [parsed.sortBy]: parsed.order },
    where: parsed.search
      ? { name: { contains: parsed.search } }
      : undefined,
  };
}
```

## Intégration dans app-cli

### Contexte d'utilisation

Dans `app-cli`, Valibot pourrait être utilisé pour :

1. **Validation de configuration CLI** : Schémas pour les fichiers de
   config
2. **Validation de schémas de machines à états** : Valider les configs
   `@bemedev/fsf`
3. **Parsing d'arguments** : Valider les inputs utilisateur
4. **Validation de fichiers générés** : S'assurer de la cohérence des
   typings

### Exemple d'intégration

```typescript
import * as v from 'valibot';
import type { createLogic } from '@bemedev/fsf';

// Schéma de validation pour une config de machine FSF
const FSFConfigSchema = v.object({
  initial: v.string(),
  data: v.string(),
  context: v.optional(v.record(v.string(), v.unknown())),
  states: v.record(
    v.string(),
    v.object({
      on: v.optional(v.record(v.string(), v.unknown())),
      always: v.optional(v.union([v.string(), v.array(v.unknown())])),
      entry: v.optional(v.union([v.string(), v.array(v.string())])),
      exit: v.optional(v.union([v.string(), v.array(v.string())])),
      data: v.optional(v.string()),
    }),
  ),
});

// Validation lors de l'extraction de fichiers
export function validateMachineConfig(config: unknown) {
  const result = v.safeParse(FSFConfigSchema, config);

  if (!result.success) {
    console.error('Configuration machine invalide:');
    result.issues.forEach(issue => {
      console.error(`  ${issue.path?.join('.')}: ${issue.message}`);
    });
    return null;
  }

  return result.output;
}
```

### Validation de la CLI config

```typescript
import * as v from 'valibot';

const CLIConfigSchema = v.object({
  input: v.union([v.string(), v.array(v.string())]),
  output: v.string(),
  watch: v.optional(v.boolean(), false),
  verbose: v.optional(v.boolean(), false),
  exclude: v.optional(v.array(v.string()), []),
  include: v.optional(v.array(v.string()), []),
});

export function loadCLIConfig(configPath: string) {
  const config = JSON.parse(readFileSync(configPath, 'utf-8'));
  return v.parse(CLIConfigSchema, config);
}
```

## Performance & Bundle Size

### Benchmark de taille

| Validation simple | Bundle (min+gzip) |
| ----------------- | ----------------- |
| Valibot           | **0.7 KB**        |
| Zod               | 11.51 KB          |
| Yup               | ~30 KB            |
| Joi               | ~145 KB           |

### Optimisation tree-shaking

Grâce au design modulaire, seules les fonctions importées sont incluses :

```typescript
// ❌ Mauvais : importe tout le package
import { object, string, email } from 'valibot';

// ✅ Meilleur : imports spécifiques (même résultat avec bundler moderne)
import * as v from 'valibot';

// Le bundler inclura seulement les fonctions utilisées
const schema = v.object({
  email: v.pipe(v.string(), v.email()),
});
```

### Test de performance

Valibot offre des performances comparables ou supérieures à Zod :

- **Parsing** : ~1-2% plus rapide
- **Validation** : Performance similaire
- **Inférence de types** : Temps de compilation similaire

## Ressources

### Documentation officielle

- 🌐 **Site web** : [valibot.dev](https://valibot.dev/) (actuellement en
  pause)
- 📦 **NPM** :
  [npmjs.com/package/valibot](https://www.npmjs.com/package/valibot)
- 🔧 **GitHub** :
  [github.com/fabian-hiller/valibot](https://github.com/fabian-hiller/valibot)
- 📚 **Thèse** : [Bachelor's Thesis PDF](https://valibot.dev/thesis.pdf)
- 📝 **Article** :
  [Introducing Valibot (Builder.io)](https://www.builder.io/blog/introducing-valibot)

### Communauté

- 💬 **Discord** : [discord.gg/tkMjQACf2P](https://discord.gg/tkMjQACf2P)
- 🐙 **Contributeurs** : 176+ contributeurs
- ⭐ **GitHub Stars** : 8,000+
- 📈 **Téléchargements** : ~2M/semaine

### Intégrations

Valibot peut être utilisé avec :

- **tRPC** : Type-safe API routes
- **React Hook Form** : Validation de formulaires React
- **FormKit** : Framework de formulaires
- **Conform** : Validation progressive
- **TanStack Forms** : Formulaires type-safe
- **Qwik** : Framework JavaScript
- **SolidJS** : Framework réactif
- **Modular Forms** : Bibliothèque de formulaires de l'auteur

### Migration depuis Zod

Un codemod `zod-to-valibot` est disponible pour faciliter la migration :

```bash
npx @valibot/codemod zod-to-valibot
```

### Contribuer

Le projet accepte les contributions :

1. Fork le repository
2. Créer une branche feature (`git checkout -b feat/amazing-feature`)
3. Commit selon les
   [conventions](https://github.com/fabian-hiller/valibot/blob/main/CONTRIBUTING.md)
4. Push (`git push origin feat/amazing-feature`)
5. Ouvrir une Pull Request

---

## License

**MIT** © [Fabian Hiller](https://github.com/fabian-hiller)

## Support TypeScript

✅ **100% TypeScript** avec inférence complète  
✅ **Sécurité des types** garantie à runtime  
✅ **Autocomplétion IDE** pour toutes les fonctions  
✅ **Type inference** pour Input et Output

---

_Dernière mise à jour : Octobre 2025_  
_Version Valibot : 1.1.0_
