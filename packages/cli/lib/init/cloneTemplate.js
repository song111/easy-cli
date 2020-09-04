"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _os = _interopRequireDefault(require("os"));

var _path = _interopRequireDefault(require("path"));

var _gitClone = _interopRequireDefault(require("git-clone"));

var _cliUtils = require("@chrissong/cli-utils");

var _selectTemplate = require("./selectTemplate");

/** 克隆模版到临时文件夹
 * @param {Object} templateParams
 *    @param {Boolean}    isBuiltTemplate
 *    @param {String}     gitAddress
 *    @param {Boolean}    isHasTs
 *    @param {Boolean}    isHasState
 *    @param {String}     pkgManager    yarn | npm
 * */
var _default = async templateParams => {
  // 创建临时目录
  const tmpdir = _path.default.join(_os.default.tmpdir(), 'easy');

  await _cliUtils.fs.remove(tmpdir); // 内置模版

  if (templateParams.isBuiltTemplate) {
    // 获取分支
    const templateBranch = (0, _selectTemplate.getTemplateBranchByParams)(templateParams);

    _cliUtils.spinner.start('✨', `克隆模板 ${_cliUtils.chalk.yellow(`${_selectTemplate.templateRepo}(${templateBranch})`)}...`);

    return new Promise((resolve, reject) => {
      (0, _gitClone.default)(_selectTemplate.templateRepo, tmpdir, {
        checkout: templateBranch
      }, err => {
        _cliUtils.spinner.stop();

        if (!err) {
          _cliUtils.logger.done(`克隆模板 ${_cliUtils.chalk.yellow(`${_selectTemplate.templateRepo}(${templateBranch})`)} 成功`);

          return resolve(tmpdir);
        } else {
          _cliUtils.logger.error(`克隆模板 ${_cliUtils.chalk.yellow(`${_selectTemplate.templateRepo}(${templateBranch})`)} 失败`);

          return reject(err);
        }
      });
    });
  } else {
    // 现有项目地址
    _cliUtils.spinner.start('⌛', `克隆项目 ${_cliUtils.chalk.yellow(`${templateParams.gitAddress})`)}...`);

    return new Promise((resolve, reject) => {
      (0, _gitClone.default)(templateParams.gitAddress, tmpdir, {
        checkout: 'master'
      }, err => {
        _cliUtils.spinner.stop();

        if (!err) {
          _cliUtils.logger.done(`克隆模板 ${_cliUtils.chalk.yellow(`${templateParams.gitAddress})`)} 成功`);

          return resolve(tmpdir);
        } else {
          _cliUtils.logger.error(`克隆模板 ${_cliUtils.chalk.yellow(`${templateParams.gitAddress})`)} 失败`);

          return reject(err);
        }
      });
    });
  }
};

exports.default = _default;
module.exports = exports.default;