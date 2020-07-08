"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _eslint = require("eslint");

var _path = _interopRequireDefault(require("path"));

var _cliUtils = require("@chrissong/cli-utils");

var _default = (cli, argv) => {
  debugger;
  const eslintCli = new _eslint.CLIEngine({
    fix: argv.fix,
    extensions: argv.ext,
    cwd: cli.root
  });
  const report = eslintCli.executeOnFiles(argv.files.map(file => _path.default.resolve(cli.cwd, file))); // 自动修复

  if (argv.fix) _eslint.CLIEngine.outputFixes(report); // 告警

  if (report.errorCount || report.warningCount) {
    // 错误警告太多就用stylish显示
    const formatter = report.errorCount + report.warningCount > 30 ? 'stylish' : 'codeframe';

    _cliUtils.logger.log(cli.getFormatter(formatter)(report.results));

    cli.exit(1);
  }
};

exports.default = _default;
module.exports = exports.default;
//# sourceMappingURL=lint.js.map