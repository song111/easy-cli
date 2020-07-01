"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

var _yargs = _interopRequireDefault(require("yargs"));

var _cliUtils = require("@chrissong/cli-utils");

var _init = _interopRequireDefault(require("./init"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

class Cli {
  constructor(cwd, argv = []) {
    this.cwd = cwd;
    this.argv = argv;
    this.plugins = [_init.default];
    this.commands = {}; // 命令集合

    this.init();
  } // 初始化


  init() {
    this.root = (0, _cliUtils.findRoot)(this.cwd);
    this.env = this.getEnv();
    this.pkg = this.resolvePackages();
    this.plugins.forEach(plugin => this.use(plugin));
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
    const pkg = _path.default.resolve(this.root, 'package.json');

    if (!_fs.default.existsSync(pkg)) return {};

    try {
      return require(pkg);
    } catch (err) {
      _cliUtils.logger.error(`读取${pkg}失败！`);

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
      throw new Error(`命令名称 ${_cliUtils.chalk.redBright(name)} 不合法，只能是字母、数字、下划线、冒号`);
    }

    if (!desc) throw new Error('命令描述 desc 不存在');
    if (this.commands[name]) throw new Error(`命令 ${_cliUtils.chalk.redBright(name)} 已经被占用`);
    this.commands[name] = _objectSpread({
      cmd,
      desc
    }, args);

    _yargs.default.command(cmd, desc, ...args);
  }
  /**
   * 解析命令行参数
   * @param {Array} argv
   */


  parse(argv) {
    this.argv = argv;

    if (this.argv.length) {
      _yargs.default.parse(this.argv);
    } else {
      _yargs.default.showHelp();
    }
  }

}

exports.default = Cli;
module.exports = exports.default;
//# sourceMappingURL=index.js.map