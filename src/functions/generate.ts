import type { CommonNodeConfig } from '../states';
import type { SingleOrArray } from '../types';
import { arrayToUnionString } from './helpers';
import { stateType } from './stateType';

type Common = CommonNodeConfig & {
  targets: string;
};

type NodeC = Atomic | Compound | Parallel;

type Atomic = Common & {
  readonly type?: 'atomic';
  readonly states?: never;
};

type Compound = Common & {
  readonly type?: 'compound';
  readonly initial: string;
  readonly states: Record<string, NodeC>;
};

type Parallel = Common & {
  readonly type: 'parallel';
  readonly states: Record<string, NodeC>;
};

/**
 * Extrait tous les paths disponibles d'un objet de configuration récursivement.
 */
function extractAllPaths(obj: any, currentPath: string = ''): string[] {
  const paths: string[] = [];

  // Ajouter le path actuel
  if (currentPath === '') {
    paths.push('/');
  } else {
    paths.push(currentPath);
  }

  // Si l'objet a des states, explorer récursivement
  if (obj.states && typeof obj.states === 'object') {
    for (const [stateName, stateConfig] of Object.entries(obj.states)) {
      const newPath =
        currentPath === ''
          ? `/${stateName}`
          : `${currentPath}/${stateName}`;
      paths.push(...extractAllPaths(stateConfig, newPath));
    }
  }

  return paths;
}

type Param = NodeC & {
  strict?: boolean;
  machines?: SingleOrArray<string>;
};

/**
 * Génère récursivement la représentation string du type enrichi.
 */
function generateNodeTypeString(
  obj: Param,
  allPaths: string[],
  currentPath: string = '/',
): string {
  const nodeTypeValue = stateType(obj);
  const properties: string[] = [];

  // Calculer les transitions disponibles (tous les paths sauf le path actuel)
  const availablePaths = allPaths.filter(path => path !== currentPath);
  const transitionsType =
    availablePaths.length > 0
      ? `Exclude<AllPaths, '${currentPath}'>`
      : 'never';

  // Propriétés de base Param
  if (obj.description !== undefined) {
    properties.push(`readonly description: '${obj.description}'`);
  }
  if (obj.entry !== undefined) {
    properties.push(`readonly entry: ${JSON.stringify(obj.entry)}`);
  }
  if (obj.exit !== undefined) {
    properties.push(`readonly exit: ${JSON.stringify(obj.exit)}`);
  }
  if (obj.tags !== undefined) {
    properties.push(`readonly tags: ${JSON.stringify(obj.tags)}`);
  }
  if (obj.activities !== undefined) {
    properties.push(
      `readonly activities: ${JSON.stringify(obj.activities)}`,
    );
  }

  properties.push(
    `readonly strict: ${JSON.stringify(obj.strict ?? false)}`,
  );

  if (obj.machines !== undefined) {
    properties.push(`readonly machines: ${JSON.stringify(obj.machines)}`);
  }

  // // Type du node
  // properties.push(`readonly type: '${nodeTypeValue}'`);

  // Gérer les states et initial pour compound/parallel
  if (obj.states && typeof obj.states === 'object') {
    // Générer le type pour les states
    const statesProperties: string[] = [];
    for (const [stateName, stateConfig] of Object.entries(obj.states)) {
      const childPath =
        currentPath === '/'
          ? `/${stateName}`
          : `${currentPath}/${stateName}`;
      const childType = generateNodeTypeString(
        stateConfig as NodeC,
        allPaths,
        childPath,
      );
      statesProperties.push(`readonly ${stateName}: ${childType}`);
    }

    const statesType = `{
        ${statesProperties.join(';\n        ')};
      }`;
    properties.push(`readonly states: ${statesType}`);

    // Pour compound, ajouter initial
    if (nodeTypeValue === 'compound') {
      const stateKeys = Object.keys(obj.states);
      const initialUnion = arrayToUnionString(...stateKeys);
      properties.push(`readonly initial: ${initialUnion}`);
    }
  }

  return `(CommonNodeConfig &
      TransitionsConfig<${transitionsType}>) & {
      ${properties.join(';\n      ')};
    }`;
}

/**
 * Génère la représentation string complète du type enrichi avec targets et TransitionsConfig.
 */
export const generate = (node: NodeC): string => {
  // Extraire tous les paths disponibles
  const allPaths = extractAllPaths(node);
  const allPathsUnion = arrayToUnionString(...allPaths);

  // Générer le type principal
  const mainType = generateNodeTypeString(node, allPaths, '/');

  // Construire la représentation complète
  return `import type { CommonNodeConfig } from '../../states';
import type { TransitionsConfig } from '../../transitions';

export type AllPaths =
  ${allPathsUnion
    .split(' | ')
    .map(path => path)
    .join('\n  | ')};

export type Enriched = ${mainType};
`.trim();
};
