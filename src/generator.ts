import { Factory } from './factory';

export interface IGenerator {
  name: string;
  descriptions?: string;
  install: (factory: Factory) => Promise<any>;
  uninstall?: (factory: Factory) => Promise<void>;
}

export const generators = new Map<string, IGenerator>();

export function registerGenerator(generator: IGenerator) {
  generators.set(generator.name, generator);
}

export function getGenerator(name: string) {
  return generators.get(name);
}

export async function useGenerator(generator: IGenerator) {
  await generator.install(new Factory());
}

export function defineGenerator(generator: IGenerator) {
  return generator;
}
