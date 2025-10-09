import * as v from 'valibot';
import { EXTENSIONS, IDENTIFIERS } from './constants';

export type Path =
  `${string}.${(typeof IDENTIFIERS)[number]}.${(typeof EXTENSIONS)[number]}`;

export const PATH_ERROR_MESSAGE = `The path must be in the format: 
"**/*.{${IDENTIFIERS.join(',')}}.{${EXTENSIONS.join(',')}}"
  e.g.:
    - "src/user.machine.ts"
    - "features/auth/login.function.ts"
`;

/**
 * Schema Valibot pour valider un Path
 * Format: ${string}.${identifier}.${extension}
 * Exemples valides:
 * - "src/user.machine.ts"
 * - "features/auth/login.function.tsx"
 */
export const Path = v.custom<Path>(value => {
  // Type guard: s'assurer que value est une string
  if (typeof value !== 'string') return false;

  // Vérifier que la chaîne contient au moins un point
  if (!value.includes('.')) return false;

  // Extraire l'extension et l'identifier
  const parts = value.split('.');
  if (parts.length < 3) return false;

  const extension = parts[parts.length - 1];
  const identifier = parts[parts.length - 2];

  // Vérifier que l'extension est valide
  if (!EXTENSIONS.includes(extension as (typeof EXTENSIONS)[number])) {
    return false;
  }

  // Vérifier que l'identifier est valide
  if (!IDENTIFIERS.includes(identifier as (typeof IDENTIFIERS)[number])) {
    return false;
  }

  return true;
}, PATH_ERROR_MESSAGE);

export const isPath = (value: unknown) => v.is(Path, value);
