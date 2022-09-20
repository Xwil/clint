import { defineGenerator } from '../../generator';

export function defineHuskyGenerator() {
  return defineGenerator({
    name: 'Husky',
    async install(factory) {
      factory.addDevDependency('husky');
      await factory.install();

      // TODO consider lint-staged
      await factory.execa('npx husky add .husky/pre-commit "npm test"');
    },
  });
}
