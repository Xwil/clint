import { Listr } from 'listr2';
import minimist from 'minimist';
import prompts from 'prompts';
import { setupGenerators } from '.';
import { getGenerator, useGenerator } from './generator';

const argv = minimist(process.argv.slice(2), {
  string: ['list'],
  alias: {
    l: 'list',
  },
});

if (argv._.length) {
  const generators = setupGenerators();

  const { choices } = (await prompts([
    {
      type: 'multiselect',
      name: 'choices',
      message: 'Pick yours',
      choices: [
        ...Array.from(generators.values()).map((generator) => ({
          title: generator.name,
          value: generator.name,
          description: generator.descriptions || '',
        })),
      ],
      instructions: false,
      // @ts-ignore onRender exists https://github.com/terkelg/prompts#onrender
      onRender(kleur) {},
    },
  ])) as { choices: string[] };

  const tasks = new Listr([]);

  choices.forEach((choice) => {
    tasks.add({
      title: choice,
      async task() {
        const generator = getGenerator(choice);
        if (!generator) return;

        await useGenerator(generator);
      },
    });
  });

  tasks.run();
}
