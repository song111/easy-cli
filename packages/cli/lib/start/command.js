"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = ['start', '启动项目开发服务', yargs => {
  yargs.option('open', {
    alias: 'o',
    type: 'boolean',
    default: false,
    describe: '是否自动打开浏览器'
  }).option('port', {
    alias: 'p',
    type: 'number',
    default: 3000,
    requiresArg: true,
    describe: '指定 devServer 端口号'
  });
}];
exports.default = _default;
module.exports = exports.default;