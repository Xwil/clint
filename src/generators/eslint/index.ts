import { join } from 'path';
import { defineGenerator } from 'src/generator';

export function defineEslintGenerator() {
  return defineGenerator({
    name: 'eslint',
    visible: true,
    deps: ['eslint', 'define-eslint-plugin'],
    async install(factory) {
      // add deps
      factory.addDevDependency('eslint', '*');
      factory.addDevDependency('eslint-define-plugin', '');

      // create rcs
      factory.createFileFromTemplate('.eslintrc.cjs', join(__dirname, './eslintrc.template'));
    },
  });
}
