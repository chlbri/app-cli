import { Project } from 'ts-morph';
import { arrayToUnionString } from './helpers';
import { stateType } from './stateType';

/**
 * Génère la représentation string d'un type TypeScript à partir d'un objet de configuration.
 * Utilise ts-morph pour créer la syntaxe TypeScript correcte avec génération récursive.
 */
export function generateNodeWithTransitionsType(
  configObject: any,
  project: Project,
): string {
  // Extraire tous les paths récursivement pour créer AllPaths
  const allPaths = extractAllPaths(configObject);
  const allPathsUnion = arrayToUnionString(...allPaths);

  // Créer un fichier temporaire pour générer le type
  const tempFile = project.createSourceFile('temp.ts', '', {
    overwrite: true,
  });

  // Générer le type AllPaths
  tempFile.addTypeAlias({
    name: 'AllPaths',
    type: allPathsUnion,
    isExported: true,
  });

  // Générer le type de base NodeConfig
  tempFile.addTypeAlias({
    name: 'BaseNodeConfig',
    type: `{
  readonly description?: string;
  readonly entry?: readonly string[];
  readonly exit?: readonly string[];
  readonly tags?: readonly string[];
  readonly activities?: Record<string, string | { guards?: string; actions?: string }>;
  readonly type?: "atomic" | "compound" | "parallel";
}`,
    isExported: true,
  });

  // Générer le type principal récursivement
  const mainType = generateNodeType(configObject, 'AllPaths');

  tempFile.addTypeAlias({
    name: 'GeneratedConfigType',
    type: mainType,
    isExported: true,
  });

  // Retourner le contenu du fichier généré
  return tempFile.getFullText();
}

/**
 * Extrait récursivement tous les paths d'un objet de configuration.
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

/**
 * Génère récursivement le type pour un node de configuration.
 */
function generateNodeType(obj: any, pathsType: string): string {
  const properties: string[] = [];
  const nodeTypeValue = stateType(obj);

  // Ajouter les propriétés de base
  if (obj.description !== undefined) {
    properties.push(`readonly description: "${obj.description}"`);
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

  // Ajouter le type déterminé
  properties.push(`readonly type: "${nodeTypeValue}"`);

  // Gérer les states récursivement
  if (obj.states && typeof obj.states === 'object') {
    const statesType = generateStatesType(obj.states, pathsType);
    properties.push(`readonly states: ${statesType}`);

    // Générer initial récursivement à partir des clés des states
    const stateKeys = Object.keys(obj.states);
    const initialType = arrayToUnionString(...stateKeys);
    properties.push(`readonly initial: ${initialType}`);
  }

  // Autres propriétés dynamiques
  for (const [key, value] of Object.entries(obj)) {
    if (
      ![
        'description',
        'entry',
        'exit',
        'tags',
        'activities',
        'type',
        'states',
      ].includes(key)
    ) {
      if (typeof value === 'string') {
        properties.push(`readonly ${key}: "${value}"`);
      } else if (typeof value === 'object' && value !== null) {
        properties.push(`readonly ${key}: ${JSON.stringify(value)}`);
      } else {
        properties.push(`readonly ${key}: ${JSON.stringify(value)}`);
      }
    }
  }

  return `(BaseNodeConfig & TransitionsConfig<${pathsType}>) & {
  ${properties.join(';\n  ')};
}`;
}

/**
 * Génère le type pour un objet states.
 */
function generateStatesType(
  states: Record<string, any>,
  pathsType: string,
): string {
  const stateProperties: string[] = [];

  for (const [stateName, stateConfig] of Object.entries(states)) {
    const stateType = generateNodeType(stateConfig, pathsType);
    stateProperties.push(`readonly ${stateName}: ${stateType}`);
  }

  return `{
  ${stateProperties.join(';\n  ')};
}`;
}
