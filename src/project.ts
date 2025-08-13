import { Project } from 'ts-morph';

export const PROJECT = new Project({
  tsConfigFilePath: `${process.cwd()}/tsconfig.json`,
});
