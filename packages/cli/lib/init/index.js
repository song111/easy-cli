"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = cli => {
  cli.register('init <name>', '初始化项目', yargs => {
    yargs.positional('name', {
      type: 'string',
      describe: '项目名称'
    });
  }, argv => require('./init')(cli, argv));
};

exports.default = _default;
module.exports = exports.default;
//# sourceMappingURL=index.js.map