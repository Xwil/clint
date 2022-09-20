import { detect, getCommand } from '@antfu/ni';
import assert from 'assert';
import { execaCommand } from 'execa';
import { existsSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { pkgUpSync } from 'pkg-up';
import type { PackageJson } from 'type-fest';

export class Factory {
  public packageJsonPath: string;
  public projectPath: string;
  private dependencies: string[];
  private devDependencies: string[];

  public constructor() {
    const cwd = process.cwd();
    this.packageJsonPath = pkgUpSync({ cwd }) || '';
    // TODO create new package.json if not found
    assert(!!this.packageJsonPath, `package.json not found at ${cwd} or parent folders`);
    this.projectPath = dirname(this.packageJsonPath);

    this.dependencies = [];
    this.devDependencies = [];
  }

  /**
   * Create new file
   * @param path file path relative to projectPath
   * @param content file content
   */
  public async createFile(path: string, content: string) {
    const filePath = join(this.projectPath, path);
    assert(existsSync(filePath), `${filePath} already exist`);
    writeFileSync(filePath, content, 'utf8');
  }

  public async createFileFromTemplate(path: string, templatePath: string) {
    const filePath = join(this.projectPath, path);

    assert(!existsSync(filePath), `${filePath} already exist`);
    const template = readFileSync(templatePath, 'utf8');
    writeFileSync(filePath, template, 'utf8');
  }

  /**
   * Remove file
   * @param path file path relative to projectPath
   */
  public async removeFile(path: string) {
    const filePath = join(this.projectPath, path);
    if (existsSync(filePath)) {
      rmSync(filePath);
    }
  }

  /** Add script in scripts field */
  public addScript(name: string, content: string, override?: boolean) {
    const packageJson = this.packageJson;
    if (!override) {
      assert(packageJson.scripts[name], `script ${name} already exist`);
    }
    packageJson.scripts[name] = content;
    this.packageJson = packageJson;
  }

  public removeScript(name: string) {
    const packageJson = this.packageJson;
    delete packageJson.scripts[name];
    this.packageJson = packageJson;
  }

  /** Add field to package.json */
  public addField(name: string, content: string | object, override?: boolean) {
    const packageJson = this.packageJson;
    if (!override) {
      assert(packageJson[name], `field ${name} already exist`);
    }
    packageJson[name] = content;
    this.packageJson = packageJson;
  }

  public removeField(name: string) {
    const packageJson = this.packageJson;
    delete packageJson[name];
    this.packageJson = packageJson;
  }

  public addDependency(name: string, version?: string) {
    this.addDepInternal(name, version);
  }

  public removeDependency(name: string) {
    const packageJson = this.packageJson;
    delete packageJson.dependencies[name];
    this.packageJson = packageJson;
  }

  public addDevDependency(name: string, version?: string) {
    this.addDepInternal(name, version, 'dev');
  }

  public removeDevDependency(name: string) {
    const packageJson = this.packageJson;
    delete packageJson.devDependencies[name];
    this.packageJson = packageJson;
  }

  public async execa(command: string) {
    return await execaCommand(command, { stdio: 'inherit' });
  }

  /**
   * install all deps from this.deps & this.devDeps
   */
  public async install() {
    const agent = await detect({});

    if (this.dependencies.length) {
      const depsCommand = getCommand(agent, 'install', this.dependencies);
      await execaCommand(depsCommand.replaceAll('"', ''));
    }

    if (this.devDependencies.length) {
      const devDepsCommand = getCommand(agent, 'install', this.devDependencies);
      await execaCommand(devDepsCommand.replaceAll('"', ''));
    }
  }

  public get packageJson(): PackageJson {
    return JSON.parse(readFileSync(this.packageJsonPath, 'utf8'));
  }

  public set packageJson(content: PackageJson) {
    writeFileSync(this.packageJsonPath, JSON.stringify(content, undefined, 2), 'utf8');
  }

  private addDepInternal(name: string, version = 'latest', type?: 'dev') {
    const pkg = `${name}@${version}`;
    if (type === 'dev') {
      this.devDependencies.push(pkg);
    } else {
      this.dependencies.push(pkg);
    }
  }
}
