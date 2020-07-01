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

var _default = async (repo, branch) => {
  _cliUtils.spinner.start('✨', `克隆模板 ${_cliUtils.chalk.yellow(`${repo}(${branch})`)}...`);

  const tmpdir = _path.default.join(_os.default.tmpdir(), 'easy');

  await _cliUtils.fs.remove(tmpdir);
  return new Promise((resolve, reject) => {
    debugger;
    (0, _gitClone.default)(repo, tmpdir, {
      shallow: true,
      checkout: branch
    }, err => {
      _cliUtils.spinner.stop();

      if (!err) return resolve(tmpdir);

      _cliUtils.logger.error(`克隆模板 ${`${repo}(${branch})`} 失败`);

      reject(err);
    });
  });
};

exports.default = _default;
module.exports = exports.default;
//# sourceMappingURL=cloneTemplate.js.map