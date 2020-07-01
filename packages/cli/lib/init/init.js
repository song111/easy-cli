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

var _cloneTemplate = _interopRequireDefault(require("./cloneTemplate"));

var _selectTemplate = require("./selectTemplate");

async function init(cli, argv) {
  const projectName = _path.default.resolve(cli.cwd, argv.name); // 项目重复验证


  if (_cliUtils.fs.existsSync(projectName)) {
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
  } // 创建本地文件模板


  const templateParams = await (0, _selectTemplate.getTemplateQues)();
  const templateBranch = (0, _selectTemplate.getTemplateBranchByParams)(templateParams);
  const tmpdirProject = await (0, _cloneTemplate.default)(_selectTemplate.templateRepo, templateBranch);
  debugger;
  console.log(templateParams, templateBranch, tmpdirProject);
}

var _default = init;
exports.default = _default;
module.exports = exports.default;
//# sourceMappingURL=init.js.map