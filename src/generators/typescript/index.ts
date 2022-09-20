import { defineGenerator } from '../../generator';

export function defineTypeScriptGenerator() {
  return defineGenerator({
    name: 'TypeScript',
    async install(factory) {
      factory.addDevDependency('typescript');
      factory.addDevDependency('tsx');
      await factory.install();

      // ? should we create tsconfig.json for users?
    },
  });
}
