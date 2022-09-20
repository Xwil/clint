import { defineGenerator } from '../../generator';

export function defineCommitizenGenerator() {
  return defineGenerator({
    name: 'Commitizen',
    async install(factory) {
      // TODO prefer install globally
      factory.addDevDependency('commitizen');
      factory.addDevDependency('cz-conventional-changelog');
      await factory.install();

      factory.addScript('commit', 'cz');
      factory.addField('config', { commitizen: { path: 'cz-conventional-changelog' } });
    },
  });
}
