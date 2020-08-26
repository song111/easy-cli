"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = _interopRequireDefault(require("path"));

var _cliUtils = require("@chrissong/cli-utils");

/**
 * 根据模版生成项目文件
 * @param{string} template    模版临时路径
 * @param{string} projectName 项目名称
 * @param{string} targetDir   项目文件路径
 */
var _default = async (template, projectName, targetDir) => {
  _cliUtils.spinner.start('📦', `生成项目 ${_cliUtils.chalk.yellow(projectName)}...`);

  const pkgPath = _path.default.resolve(template, './package.json');

  const pkgJson = await _cliUtils.fs.readJson(pkgPath);
  pkgJson.name = projectName;
  await _cliUtils.fs.writeJson(pkgPath, pkgJson, {
    spaces: 2
  });
  await _cliUtils.fs.ensureDir(targetDir); // 创建本地项目

  await Promise.all(_cliUtils.fs.readdirSync(template).map(file => {
    return _cliUtils.fs.move(_path.default.join(template, file), _path.default.join(targetDir, file), {
      overwrite: true
    });
  }));

  _cliUtils.spinner.stop();
};

exports.default = _default;
module.exports = exports.default;