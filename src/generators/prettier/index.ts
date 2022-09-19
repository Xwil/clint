import { join } from 'path';
import { defineGenerator } from '../../generator';
import { __dirname } from '../../utils';

export function definePrettierGenerator() {
  return defineGenerator({
    name: 'Prettier',
    async install(factory) {
      factory.addDevDependency('prettier', '*');
      factory.addDevDependency('prettier-plugin-packagejson', '');
      factory.addDevDependency('prettier-plugin-organize-imports', '');
      await factory.install();

      await factory.createFileFromTemplate('.prettierrc.cjs', join(__dirname(import.meta), './prettierrc.template'));
      await factory.createFileFromTemplate(
        '.prettierignore',
        join(__dirname(import.meta), './prettierignore.template'),
      );
    },
  });
}
