"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _path = _interopRequireDefault(require("path"));

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var _default = function _default(cwd) {
  var directory = _path["default"].resolve(cwd || '');

  var _path$parse = _path["default"].parse(directory),
      root = _path$parse.root;

  while (true) {
    if (_fsExtra["default"].existsSync(_path["default"].resolve(directory, 'package.json'))) return directory;
    if (directory === root) return;
    directory = _path["default"].dirname(directory);
  }
};

exports["default"] = _default;
module.exports = exports.default;