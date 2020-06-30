"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = _interopRequireDefault(require("path"));

var _inquirer = _interopRequireDefault(require("inquirer"));

var _which = _interopRequireDefault(require("which"));

var _cliUtils = require("@chrissong/cli-utils");

async function init(cli, argv) {
  const projectName = _path.default.resolve(cli.cwd, argv.name); // 项目重复验证


  if (_cliUtils.fs.existSync(projectName)) {
    const {
      isOverWrite
    } = await _inquirer.default.prompt([{
      name: 'isOverWrite',
      message: `当前文件夹已存在${_cliUtils.chalk.cyan(argv.name)},是否覆盖?`,
      type: 'confirm',
      default: true
    }]);

    if (isOverWrite) {
      logger.log(`\n删除目录 ${_cliUtils.chalk.cyan(targetDir)}...`);
      await _cliUtils.fs.remove(targetDir);
    }
  }
}

var _default = init;
exports.default = _default;
module.exports = exports.default;
//# sourceMappingURL=init.js.map