/**
 * Transforms an array of literals (string, number, boolean) into a TypeScript union string representation.
 * Example: ['a', 'b', 1, true] => "'a' | 'b' | 1 | true"
 */
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
