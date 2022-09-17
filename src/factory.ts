import assert from 'assert';
import { existsSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';
import { pkgUpSync } from 'pkg-up';
import type { PackageJson } from 'type-fest';

export class Factory {
  // public cwd: string;
  public packageJsonPath: string;
  public projectPath: string;

  public constructor() {
    const cwd = process.cwd();
    this.packageJsonPath = pkgUpSync({ cwd }) || '';
    // TODO create new package.json if not found
    assert(!!this.packageJsonPath, `package.json not found at ${cwd} or parent folders`);
    this.projectPath = resolve(this.packageJsonPath, './');
  }

  /** create new file
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
    assert(existsSync(filePath), `${filePath} already exist`);
    const template = readFileSync(templatePath, 'utf8');
    writeFileSync(filePath, template, 'utf8');
  }

  /** remove file
   * @param path file path relative to projectPath
   */
  public async removeFile(path: string) {
    const filePath = join(this.projectPath, path);
    if (existsSync(filePath)) {
      rmSync(filePath);
    }
  }

  public async addScript(name: string, content: string, override?: false) {
    const packageJson = this.packageJson;
    if (!override) {
      assert(packageJson.scripts[name], `script ${name} already exist`);
    }
    packageJson.scripts[name] = content;
    this.packageJson = packageJson;
  }

  public async removeScript(name: string) {
    const packageJson = this.packageJson;
    delete packageJson.scripts[name];
    this.packageJson = packageJson;
  }

  public async addDependency(name: string, version: string, override?: boolean) {
    this.addDepInternal(name, version, override);
  }

  public async removeDependency(name: string) {
    const packageJson = this.packageJson;
    delete packageJson.dependencies[name];
    this.packageJson = packageJson;
  }

  public async addDevDependency(name: string, version: string, override?: boolean) {
    this.addDepInternal(name, version, override, 'dev');
  }

  public async removeDevDependency(name: string) {
    const packageJson = this.packageJson;
    delete packageJson.devDependencies[name];
    this.packageJson = packageJson;
  }

  public async install() {}

  public get packageJson(): PackageJson {
    return JSON.parse(readFileSync(this.packageJsonPath, 'utf8'));
  }

  public set packageJson(content: PackageJson) {
    writeFileSync(this.packageJsonPath, JSON.stringify(content, undefined, 2), 'utf8');
  }

  // eslint-disable-next-line max-params
  private addDepInternal(name: string, version: string, override: boolean, type?: 'dev') {
    const field = type === 'dev' ? 'devDependencies' : 'dependencies';
    const packageJson = this.packageJson;
    const deps = packageJson[field];

    !override && assert(deps[name], `${field} ${name} already exist`);

    packageJson[name] = version;
    this.packageJson = packageJson;
  }
}
