"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _cliUtils = require("@chrissong/cli-utils");

var _readline = _interopRequireDefault(require("readline"));

/**
 * 安装依赖
 * @param{string} pkgManager yarn|npm
 * @param{string} targetDir  项目路径
 */
var _default = async (pkgManager, targetDir) => {
  const args = pkgManager === 'npm' ? ['install', '--loglevel', 'error'] : ['install'];
  debugger;
  const cmd = `${pkgManager} ${args.join(' ')}`;

  _cliUtils.logger.log(`🚀  安装项目依赖 ${_cliUtils.chalk.cyan(cmd)}，请稍等...`);

  debugger;
  return new Promise((resolve, reject) => {
    const child = (0, _cliUtils.execa)(pkgManager, args, {
      cwd: targetDir,
      stdio: ['inherit', 'inherit', 'pipe']
    });

    if (pkgManager === 'yarn') {
      child.stderr.on('data', buf => {
        const str = buf.toString();
        if (/warning/.test(str)) return;
        const progressBarMatch = str.match(/\[.*\] (\d+)\/(\d+)/);

        if (progressBarMatch) {
          // since yarn is in a child process, it's unable to get the width of
          // the terminal. reimplement the progress bar ourselves!
          renderProgressBar(progressBarMatch[1], progressBarMatch[2]);
          return;
        }

        process.stderr.write(buf);
      });
    }

    child.on('close', code => {
      if (code !== 0) {
        reject(`pkgManager failed: ${pkgManager} ${args.join(' ')}`);
        return;
      }

      resolve();
    });
  });
}; // 进度读取来自于 vue-cli


exports.default = _default;

function renderProgressBar(curr, total) {
  const ratio = Math.min(Math.max(curr / total, 0), 1);
  const bar = ` ${curr}/${total}`;
  const availableSpace = Math.max(0, process.stderr.columns - bar.length - 3);
  const width = Math.min(total, availableSpace);
  const completeLength = Math.round(width * ratio);
  const complete = `#`.repeat(completeLength);
  const incomplete = `-`.repeat(width - completeLength);
  toStartOfLine(process.stderr);
  process.stderr.write(`[${complete}${incomplete}]${bar}`);
}

function toStartOfLine(stream) {
  if (!_cliUtils.chalk.supportsColor) {
    stream.write('\r');
    return;
  }

  _readline.default.cursorTo(stream, 0);
}

module.exports = exports.default;
//# sourceMappingURL=install.js.map