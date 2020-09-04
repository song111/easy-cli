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

var _selectTemplate = require("./selectTemplate");

var _cloneTemplate = _interopRequireDefault(require("./cloneTemplate"));

var _generateProject = _interopRequireDefault(require("./generateProject"));

var _install = _interopRequireDefault(require("./install"));

/**
 * 项目初始化
 * @param{object} cli   cli实例对象
 * @param{object} argv  命令行参数
 */
async function init(cli, argv) {
  const targetDir = _path.default.resolve(cli.cwd, argv.name); // 项目名称校验
  // 项目重复验证


  if (_cliUtils.fs.existsSync(targetDir)) {
    const {
      isOverWrite
    } = await _inquirer.default.prompt([{
      name: 'isOverWrite',
      message: `当前文件夹已存在${_cliUtils.chalk.cyan(argv.name)},是否覆盖?`,
      type: 'confirm',
      default: true
    }]);

    if (isOverWrite) {
      _cliUtils.logger.log(`\n删除目录 ${_cliUtils.chalk.cyan(targetDir)}...`);

      await _cliUtils.fs.remove(targetDir);
    }
  } // 创建本地文件模板


  const templateParams = await (0, _selectTemplate.getTemplateParams)();
  debugger;
  const projectTmpdir = await (0, _cloneTemplate.default)(templateParams); //  模版临时文件地址
  // 生成项目

  await (0, _generateProject.default)(projectTmpdir, argv.name, targetDir);
  const pkgManager = templateParams.pkgManager === 'yarn' ? _which.default.sync('yarn', {
    nothrow: true
  }) ? 'yarn' : 'npm' : 'npm'; // 安装依赖

  await (0, _install.default)(pkgManager, targetDir);
}

var _default = init;
exports.default = _default;
module.exports = exports.default;