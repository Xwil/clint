import { defineGenerator } from '../../generator';

export function defineLintStagedGenerate() {
  return defineGenerator({
    name: 'Lint-staged',
    async install(factory) {
      factory.addDevDependency('lint-staged');
      await factory.install();

      // TODO consider eslint & prettier & stylelint
      factory.addField('lint-staged', { '*.(js|ts|tsx|jsx|md|json)': ['prettier --write', 'eslint --fix', 'eslint'] });
    },
  });
}
