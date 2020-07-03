import path from 'path';
import fs from 'fs';
import yargs from 'yargs';
import fkill from 'fkill';
import { fork } from 'child_process';
import { logger, findRoot, chalk } from '@chrissong/cli-utils';
import init from './init';
import start from './start';
import build from './build'

export default class Cli {
  constructor (cwd, argv = []) {
    this.cwd = cwd;
    this.argv = argv;
    this.plugins = [init, start, build];
    this.commands = {}; // 命令集合
    this.subprocess = []; // 子进程
    this.init();
  }

  // 初始化
  init () {
    this.root = findRoot(this.cwd);
    this.env = this.getEnv();
    this.pkg = this.resolvePackages();
    this.plugins.forEach((plugin) => this.use(plugin));
  }

  /**
   * 版本信息
   */

  get version () {
    return this.pkg.version;
  }

  /**
   * 子进程执行脚本
   * @param {String} path
   * @param  {String[]} argv
   * @param  {Object} options
   */
  fork (path, argv, options) {
    const subprocess = fork(path, argv, {
      env: this.env, // 子进程继承当前环境的环境变量
      execArgv: [`--inspect-brk=127.0.0.1:${process.debugPort + 1}`], // 开发模式
      ...options
    });

    subprocess.on('close', () => {
      const index = this.subprocess.findIndex((item) => item === subprocess);
      this.subprocess.splice(index, 1);
    });

    this.subprocess.push(subprocess);
    return subprocess;
  }

  /**
   * 退出进程
   * @param {Number} code
   **/
  async exit (code) {
    const subPIds = this.subprocess.map((subp) => subp.pid);
    await fkill(subPIds, { force: true, tree: true });
    process.exit(code);
  }

  /**
   * 获取当前环境的环境变量
   */
  getEnv () {
    return Object.keys(process.env).reduce((env, key) => {
      env[key] = process.env[key];
      return env;
    }, {});
  }

  /**
   * 使用插件 注入cli 实例
   * @param {Function} plugin
   */

  use (plugin) {
    plugin(this);
  }

  /**
   * 获取package.json信息
   */
  resolvePackages () {
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
  register (cmd, desc, ...args) {
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
  parse (argv) {
    this.argv = argv;
    if (this.argv.length) {
      yargs.parse(this.argv);
    } else {
      yargs.showHelp();
    }
  }
}
