import { join } from 'path';
import { defineGenerator } from '../../generator';
import { __dirname } from '../../utils';

export function defineCommitlintGenerator() {
  return defineGenerator({
    name: 'Commitlint',
    async install(factory) {
      factory.addDevDependency('@commitlint/cli');
      factory.addDevDependency('@commitlint/config-conventional');
      await factory.install();

      await factory.createFileFromTemplate(
        '.commitlint.config.cjs',
        join(__dirname(import.meta), './commitlint.template'),
      );
    },
  });
}
