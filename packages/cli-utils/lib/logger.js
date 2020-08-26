"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _chalk = _interopRequireDefault(require("chalk"));

function format(label, msg) {
  return msg.split('\n').map(function (line, i) {
    return i === 0 ? "".concat(label, " ").concat(line) : line.padStart(_chalk["default"].reset(label).length);
  }).join('\n');
}

var log = function log() {
  var msg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return console.log(msg);
};

var done = function done() {
  var msg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return console.log(format(_chalk["default"].bgGreen.black(' DONE '), msg));
};

var warn = function warn() {
  var msg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return console.warn(format(_chalk["default"].bgYellow.black(' WARN '), _chalk["default"].yellow(msg)));
};

var error = function error() {
  var msg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return console.error(format(_chalk["default"].bgRed(' ERROR '), _chalk["default"].red(msg)));
};

var _default = {
  log: log,
  done: done,
  error: error,
  warn: warn
};
exports["default"] = _default;
module.exports = exports.default;