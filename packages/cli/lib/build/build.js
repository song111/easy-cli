"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _cliWebpack = require("@chrissong/cli-webpack");

var _cliUtils = require("@chrissong/cli-utils");

/**
 * 使用子进程是为了修正webpack执行的时候的process.cwd
 * 如果不正确则可能出现打包错误
 */
var _default = (cli, argv) => {
  _cliUtils.logger.log('🚀  正在打包,请稍等...');

  (0, _cliUtils.loadEnv)(process.cwd()); // 先设置环境变量，以便在配置文件中使用

  const env = Object.assign(process.env, {
    CMD: 'build',
    NODE_ENV: 'production',
    BABEL_ENV: 'production'
  });
  debugger;
  (0, _cliWebpack.build)({
    env: env,
    argv: argv,
    context: cli.root,
    easyConfig: (0, _cliUtils.getEasyConfig)(cli.root)
  }).catch(err => {
    _cliUtils.logger.log(err);

    process.exit(1);
  });
};

exports.default = _default;
module.exports = exports.default;
//# sourceMappingURL=build.js.map