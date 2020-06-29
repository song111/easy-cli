import path from 'path';
import fs from 'fs';
import yargs from 'yargs';
import { logger, findRoot, chalk } from '@chrissong/cli-utils';

export default class Cli {
  constructor(cwd, argv = []) {
    this.cwd = cwd;
    this.argv = argv;
    this.env = this.getEnv();
    this.root = findRoot(cwd);
    this.pkg = this.resolvePackages();
    this.commands = {}; // 命令集合
  }

  get version() {
    return this.pkg.version;
  }

  // 获取当前环境变量
  getEnv() {
    debugger;
    return Object.keys(process.env).reduce((env, key) => {
      env[key] = process.env[key];
      return env;
    }, {});
  }

  // 获取 package.json
  resolvePackages() {
    const pkg = path.resolve(this.root, 'package.json');
    if (!fs.existsSync(pkg)) return {};
    try {
      return require(pkg);
    } catch (err) {
      logger.error(`读取${pkg}失败！`);
      return {};
    }
  }

  /**
   * 注册命令
   * @param {String} cmd
   * @param {String} desc
   * @param  {...any} args
   */
  register(cmd, desc, ...args) {
    const name = cmd.split(/\s+/)[0];

    if (!/^[\w:]+$/.test(name)) {
      // 只能有数字、字母、下划线、冒号组成
      throw new Error(`命令名称 ${chalk.redBright(name)} 不合法，只能是字母、数字、下划线、冒号`);
    }

    if (!desc) throw new Error('命令描述 desc 不存在');
    if (this.commands[name]) throw new Error(`命令 ${chalk.redBright(name)} 已经被占用`);
    this.commands[name] = args;
    yargs.command(...args);
  }

  /**
   * 解析命令行参数
   * @param {Array} argv
   */
  parse(argv) {
    this.argv = argv;
    if (this.argv.length) {
      yargs.parse(this.argv);
    } else {
      yargs.showHelp();
    }
  }
}
