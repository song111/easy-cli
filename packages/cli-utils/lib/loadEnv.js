"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _path = _interopRequireDefault(require("path"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _dotenvExpand = _interopRequireDefault(require("dotenv-expand"));

/**
 * 加载项目环境变量
 * @param{string} cwd  项目目录
 */
var loadEnv = function loadEnv(cwd) {
  var basePath = _path["default"].resolve(cwd, '.env');

  try {
    var env = _dotenv["default"].config({
      path: basePath
    });

    (0, _dotenvExpand["default"])(env);
  } catch (err) {
    if (err.toString().indexOf('ENOENT') < 0) {
      throw err;
    }
  }
};

var _default = loadEnv;
exports["default"] = _default;
module.exports = exports.default;
//# sourceMappingURL=loadEnv.js.map