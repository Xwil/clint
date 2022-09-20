import { join } from 'path';
import { defineGenerator } from '../../generator';
import { __dirname } from '../../utils';

export function defineEslintGenerator() {
  return defineGenerator({
    name: 'ESLint',
    descriptions: 'Will install Prettier as well.',
    async install(factory) {
      factory.addDevDependency('eslint');
      factory.addDevDependency('eslint-define-config');
      await factory.install();

      // TODO consider prettier
      await factory.createFileFromTemplate('.eslintrc.cjs', join(__dirname(import.meta), './eslintrc.template'));
      await factory.createFileFromTemplate('.eslintignore', join(__dirname(import.meta), './eslintignore.template'));
    },
  });
}
