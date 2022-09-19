import { generators, registerGenerator } from './generator';
import { defineEslintGenerator } from './generators/eslint';
import { definePrettierGenerator } from './generators/prettier';

export const setupGenerators = () => {
  registerGenerator(defineEslintGenerator());
  registerGenerator(definePrettierGenerator());

  return generators;
};
