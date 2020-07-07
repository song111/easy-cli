"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _path = _interopRequireDefault(require("path"));

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var logger = _interopRequireWildcard(require("./logger"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/**
 * 获取环境变量
 * @param {*} mode
 * @param {*} env
 */
var _default = function _default(mode, env) {
  if (mode) {
    return _objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread({}, expand(parse('.env'))), expand(parse('.env.local'))), expand(parse(".env.".concat(mode)))), expand(parse(".env.".concat(mode, ".local")))), expand(env));
  } else {
    return _objectSpread(_objectSpread(_objectSpread({}, expand(parse('.env'))), expand(parse('.env.local'))), expand(env));
  }
};
/**
   * 解析.env文件
   * @param {*} file
   */


exports["default"] = _default;

function parse(file) {
  // 从.env文件读取环境变量
  var filename = _path["default"].resolve(process.cwd(), file);

  if (!_fsExtra["default"].existsSync(filename)) return {};

  try {
    return _dotenv["default"].parse(_fsExtra["default"].readFileSync(filename, {
      encoding: 'utf-8'
    }));
  } catch (err) {
    logger.error("".concat(filename, " \u6587\u4EF6\u89E3\u6790\u9519\u8BEF"));
    return {};
  }
}
/**
 * 解析env变量中的为环境变量值
 * @param {*} env
 */


function expand() {
  var env = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  Object.keys(env).forEach(function (key) {
    env[key] = interpolate(env[key]);
    process.env[key] = env[key];
  });
  return env;
}
/**
   * 解析值
   * @param {*} value
   *  @param {*} env
   */


function interpolate(value, env) {
  var matches = value.match(/(.?\${?(?:[a-zA-Z0-9_]+)?}?)/g) || [];
  return matches.reduce(function (envs, match) {
    var parts = /(.?)\${?([a-zA-Z0-9_]+)?}?/g.exec(match);
    var prefix = parts[1];

    if (prefix === '\\') {
      var replacePart = parts[0];
      return envs.replace(replacePart, replacePart.replace('\\$', '$'));
    } else {
      var key = parts[2];

      var _replacePart = parts[0].substring(prefix.length);

      var _value = Object.prototype.hasOwnProperty.call(process.env, key) ? process.env[key] : env[key] || '';

      return envs.replace(_replacePart, interpolate(_value));
    }
  }, value);
}

module.exports = exports.default;
//# sourceMappingURL=dotenv.js.map