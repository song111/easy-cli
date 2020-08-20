"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

var _findRoot = _interopRequireDefault(require("./findRoot"));

var getEasyConfig = function getEasyConfig(cwd) {
  var root = (0, _findRoot["default"])(cwd || process.cwd()) || process.cwd();

  var configPath = _path["default"].resolve(root, './easy.config.js');

  debugger;

  if (!_fs["default"].existsSync(configPath)) {
    throw new Error("".concat(root, " \u8DEF\u5F84\u4E0B\u6CA1\u6709 easy.config.js \u914D\u7F6E\u6587\u4EF6"));
  }

  return require(configPath);
};

var _default = getEasyConfig;
exports["default"] = _default;
module.exports = exports.default;
//# sourceMappingURL=getEasyConfig.js.map