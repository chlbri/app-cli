import { Project } from 'ts-morph';
import { describe, expect, test } from 'vitest';
import { generateNodeWithTransitionsType } from './generateNodeWithTransitionsType';

describe('generateNodeWithTransitionsType', () => {
  test('should generate TypeScript type for simple config', () => {
    const project = new Project();

    const simpleConfig = {
      description: 'Simple state machine',
      states: {
        idle: {
          activities: { DELAY: 'inc' },
        },
        working: {
          type: 'parallel',
          activities: { DELAY2: 'inc2' },
        },
        final: {},
      },
    };

    const result = generateNodeWithTransitionsType(simpleConfig, project);

    expect(result).toContain('export type AllPaths');
    expect(result).toContain('export type BaseNodeConfig');
    expect(result).toContain('export type GeneratedConfigType');
    expect(result).toContain("'/' | '/idle' | '/working' | '/final'");
    expect(result).toContain("initial: 'idle' | 'working' | 'final'");

    console.log('Simple config type:', result);
  });

  test('should generate TypeScript type for nested config', () => {
    const project = new Project();

    const nestedConfig = {
      states: {
        idle: {
          activities: { DELAY: 'inc' },
        },
        working: {
          type: 'parallel',
          states: {
            fetch: {
              states: {
                idle: { activities: { DELAY: 'sendPanelToUser' } },
                fetch: { activities: {} },
              },
            },
            ui: {
              states: {
                idle: {},
                input: {
                  activities: {
                    DELAY: {
                      guards: 'isInputEmpty',
                      actions: 'askUsertoInput',
                    },
                  },
                  states: { data: {} },
                },
                final: {},
              },
            },
          },
        },
        final: {},
      },
    };

    const result = generateNodeWithTransitionsType(nestedConfig, project);

    expect(result).toContain('export type AllPaths');
    expect(result).toContain('export type GeneratedConfigType');

    // Vérifier que tous les paths imbriqués sont présents
    expect(result).toContain('/working/fetch');
    expect(result).toContain('/working/ui/input');
    expect(result).toContain('/working/ui/input/data');

    // Vérifier les types initial pour les états compound
    expect(result).toContain("initial: 'idle' | 'working' | 'final'"); // Root level
    expect(result).toContain("initial: 'fetch' | 'ui'"); // Working level
    expect(result).toContain("initial: 'idle' | 'fetch'"); // Fetch level
    expect(result).toContain("initial: 'idle' | 'input' | 'final'"); // UI level

    console.log('Nested config type:', result);
  });

  test('should handle atomic states correctly', () => {
    const project = new Project();

    const atomicConfig = {
      description: 'Atomic state',
      activities: { DELAY: 'inc' },
    };

    const result = generateNodeWithTransitionsType(atomicConfig, project);

    expect(result).toContain('export type AllPaths');
    expect(result).toContain("'/'"); // Only root path
    expect(result).toContain('readonly type: "atomic"');
    expect(result).not.toContain('initial:'); // No initial for atomic states

    console.log('Atomic config type:', result);
  });

  test('should handle parallel states correctly', () => {
    const project = new Project();

    const parallelConfig = {
      type: 'parallel',
      states: {
        region1: { activities: { ACTION1: 'do1' } },
        region2: { activities: { ACTION2: 'do2' } },
      },
    };

    const result = generateNodeWithTransitionsType(
      parallelConfig,
      project,
    );

    expect(result).toContain('readonly type: "parallel"');
    expect(result).toContain("initial: 'region1' | 'region2'");
    expect(result).toContain('/region1');
    expect(result).toContain('/region2');

    console.log('Parallel config type:', result);
  });

  test('should extract all paths recursively', () => {
    const project = new Project();

    const deepConfig = {
      states: {
        level1: {
          states: {
            level2: {
              states: {
                level3: {
                  activities: { DEEP: 'action' },
                },
              },
            },
          },
        },
      },
    };

    const result = generateNodeWithTransitionsType(deepConfig, project);

    expect(result).toContain('/level1/level2/level3');
    expect(result).toContain(
      "'/' | '/level1' | '/level1/level2' | '/level1/level2/level3'",
    );

    console.log('Deep config type:', result);
  });
});
