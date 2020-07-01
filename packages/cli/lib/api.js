"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _default = function _default(cli) {
  return {
    /**
     * 获取命令执行路径
     */
    cwd: function cwd() {
      return cli.cwd;
    },

    /**
     * 获取package.json的内容
     */
    pkg: function pkg() {
      return cli.pkg;
    },

    /**
     * 获取当前环境的所有环境变量
     */
    env: function env() {
      return cli.env;
    },

    /**
     * 获取process.argv.slice(2)
     */
    argv: function argv() {
      return cli.argv;
    },

    /**
     * 获取项目根目录
     */
    root: function root() {
      return cli.root;
    },

    /**
     * 获取cli版本
     */
    version: function version() {
      return cli.version;
    },

    /**
     * 注册命令
     * api内容可参考yargs
     * @param {String} cmd
     * @param {String} desc
     * @param  {...any} args
     */
    register: function register(cmd, desc) {
      var name = cmd.split(/\s+/)[0]; // 只能有数字、字母、下划线、冒号组成

      if (!/^[\w:]+$/.test(name)) throw new Error("\u547D\u4EE4\u540D\u79F0 ".concat(chalk.redBright(name), " \u4E0D\u5408\u6CD5\uFF0C\u53EA\u80FD\u662F\u5B57\u6BCD\u3001\u6570\u5B57\u3001\u4E0B\u5212\u7EBF\u3001\u5192\u53F7"));
      if (!desc) throw new Error('命令描述 desc 不存在');
      if (cli.commands[name]) throw new Error("\u547D\u4EE4 ".concat(chalk.redBright(name), " \u5DF2\u7ECF\u88AB\u5360\u7528"));

      for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }

      cli.register.apply(cli, [name, cmd, desc].concat(args));
    }
  };
};

exports["default"] = _default;
module.exports = exports.default;
//# sourceMappingURL=api.js.map