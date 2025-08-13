import { describe, expect, test } from 'vitest';
import { arrayToUnionString } from './helpers';

describe('arrayToUnionString', () => {
  test('should handle string literals', () => {
    expect(arrayToUnionString('a', 'b', 'c')).toBe("'a' | 'b' | 'c'");
  });

  test('should handle number literals', () => {
    expect(arrayToUnionString(1, 2, 3)).toBe('1 | 2 | 3');
  });

  test('should handle boolean literals', () => {
    expect(arrayToUnionString(true, false)).toBe('true | false');
  });

  test('should handle mixed literals', () => {
    expect(arrayToUnionString('a', 1, false)).toBe("'a' | 1 | false");
  });

  test('should handle single value', () => {
    expect(arrayToUnionString('x')).toBe("'x'");
    expect(arrayToUnionString(42)).toBe('42');
    expect(arrayToUnionString(true)).toBe('true');
  });

  test('should handle empty array', () => {
    expect(arrayToUnionString()).toBe('');
  });
});
