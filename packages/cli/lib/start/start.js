"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = _interopRequireDefault(require("path"));

var _chokidar = _interopRequireDefault(require("chokidar"));

var _fkill = _interopRequireDefault(require("fkill"));

var _cliUtils = require("@chrissong/cli-utils");

const start = cli => {
  return cli.fork(_path.default.resolve(__dirname, './server.js'), cli.argv, {
    cwd: cli.root,
    env: cli.env,
    stdio: 'inherit'
  }).on('message', msg => msg === 'EXIT_WITH_ERROR' && cli.exit(1));
};

var _default = (cli, argv) => {
  _cliUtils.logger.log('📦  正在启动开发服务,请稍等...');

  let startProcess = start(cli); //   监听配置文件的变化

  const watcher = _chokidar.default.watch(['.env', '.eslintrc', '.eslintrc.js', '.eslintignore', '.babelrc', 'babel.config.js', '.browserslistrc', 'easy.config.js', 'tsconfig.json'], {
    cwd: cli.cwd
  });

  watcher.on('change', async () => {
    _cliUtils.logger.log('📦  检测到配置文件变化,服务正在自动重启...');

    await (0, _fkill.default)(startProcess.pid);
    startProcess = start(cli);
  });
};

exports.default = _default;
module.exports = exports.default;
//# sourceMappingURL=start.js.map