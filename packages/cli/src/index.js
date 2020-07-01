import path from 'path';
import fs from 'fs';
import yargs from 'yargs';
import { logger, findRoot, chalk } from '@chrissong/cli-utils';
import init from './init';

export default class Cli {
  constructor(cwd, argv = []) {
    this.cwd = cwd;
    this.argv = argv;
    this.plugins = [init];
    this.commands = {}; // 命令集合
    this.init();
  }

  // 初始化
  init() {
    this.root = findRoot(this.cwd);
    this.env = this.getEnv();
    this.pkg = this.resolvePackages();
    this.plugins.forEach((plugin) => this.use(plugin));
  }

  /**
   * 版本信息
   */

  get version() {
    return this.pkg.version;
  }

  /**
   * 获取当前环境的环境变量
   */
  getEnv() {
    return Object.keys(process.env).reduce((env, key) => {
      env[key] = process.env[key];
      return env;
    }, {});
  }

  /**
   * 使用插件 注入cli 实例
   * @param {Function} plugin
   */

  use(plugin) {
    plugin(this);
  }

  /**
   * 获取package.json信息
   */
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
    this.commands[name] = { cmd, desc, ...args };
    yargs.command(cmd, desc, ...args);
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
