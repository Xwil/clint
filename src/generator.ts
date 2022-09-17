import { Factory } from './factory';

export interface IGenerator {
  name: string;
  visible: boolean;
  deps: string[];
  install: (factory: Factory) => Promise<any>;
  uninstall?: (factory: Factory) => Promise<void>;
}

export const generators = new Map<string, IGenerator>();

export function registerGenerator(generator: IGenerator) {
  generators.set(generator.name, generator);
}

export function getGenerator(name: string) {
  generators.get(name);
}

export function useGenerator(generator: IGenerator) {
  generator.install(new Factory());
}

export function defineGenerator(generator: IGenerator) {
  return generator;
}
