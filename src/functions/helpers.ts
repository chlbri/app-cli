import { stateType } from '@bemedev/app-ts/lib/states/functions/stateType.js';
import { extname } from 'node:path';

export const withoutExtension = (_file: string) => {
  const extension = extname(_file);
  const file = _file.slice(0, _file.length - extension.length);

  return {
    file,
    extension,
  };
};

export function arrayToUnionString(
  ...arr: Array<string | number | boolean>
): string {
  return arr
    .map(v =>
      typeof v === 'string'
        ? `'${v}'`
        : typeof v === 'boolean'
          ? v
            ? 'true'
            : 'false'
          : v,
    )
    .join(' | ');
}

export const extractAllPaths = (
  obj: any,
  currentPath: string = '',
): string[] => {
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
};

export const buildPaths = (
  ...args: { paths: string; variable: string }[]
) => {
  return `export type _AllPaths = {
    ${args.map(arg => `${arg.variable}: ${arg.paths};`).join('\n    ')}
  }`;
};

export const generateTypesString = (
  obj: any,
  allPaths: string[],
  variable: string,
  currentPath = '/',
): string => {
  const nodeTypeValue = stateType(obj);
  const properties: string[] = [];

  // Calculer les transitions disponibles (tous les paths sauf le path actuel)
  const availablePaths = allPaths.filter(path => path !== currentPath);
  const transitionsType =
    availablePaths.length > 0
      ? `Exclude<_AllPaths['${variable}'], '${currentPath}'>`
      : undefined;

  if (transitionsType)
    properties.push(`readonly targets: ${transitionsType};`);
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
      const childType = generateTypesString(
        stateConfig,
        allPaths,
        variable,
        childPath,
      );
      statesProperties.push(`readonly ${stateName}: ${childType};`);
    }

    const statesType = `{
        ${statesProperties.join('\n   ')}
      }`;
    properties.push(`readonly states: ${statesType};`);

    // Pour compound, ajouter initial
    if (nodeTypeValue === 'compound') {
      const stateKeys = Object.keys(obj.states);
      const initialUnion = arrayToUnionString(...stateKeys);
      properties.push(`readonly initial: ${initialUnion};`);
    }
  }

  return `{
      ${properties.join('\n      ')}
    }`;
};
