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

/**克隆模版到临时文件夹
 * @param{string} repo      git地址
 * @param{string} branchName    分支名称
 * */
var _default = async (repo, branchName) => {
  _cliUtils.spinner.start('✨', `克隆模板 ${_cliUtils.chalk.yellow(`${repo}(${branchName})`)}...`);

  const tmpdir = _path.default.join(_os.default.tmpdir(), 'easy');

  await _cliUtils.fs.remove(tmpdir);
  return new Promise((resolve, reject) => {
    (0, _gitClone.default)(repo, tmpdir, {
      checkout: branchName
    }, err => {
      _cliUtils.spinner.stop();

      if (!err) {
        _cliUtils.logger.done(`克隆模板 ${`${repo}(${branchName})`} 成功`);

        return resolve(tmpdir);
      } else {
        _cliUtils.logger.error(`克隆模板 ${`${repo}(${branchName})`} 失败`);

        return reject(err);
      }
    });
  });
};

exports.default = _default;
module.exports = exports.default;
//# sourceMappingURL=cloneTemplate.js.map