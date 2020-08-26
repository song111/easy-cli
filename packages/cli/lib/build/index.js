"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = api => {
  api.register('build', '打包项目文件', yargs => {
    yargs.option('report', {
      alias: 'r',
      describe: '生成打包报告文件，可指定文件名'
    }).option('sourcemap', {
      alias: 's',
      type: 'boolean',
      default: false,
      describe: '是否生成source map'
    });
  }, argv => {
    require('./build')(api, argv);
  });
};

exports.default = _default;
module.exports = exports.default;