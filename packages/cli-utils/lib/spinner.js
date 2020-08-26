"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pause = exports.resume = exports.stop = exports.start = void 0;

var _ora = _interopRequireDefault(require("ora"));

var _chalk = _interopRequireDefault(require("chalk"));

var spinner = (0, _ora["default"])();
var lastMsg = null;

var start = function start(symbol, msg) {
  if (!msg) {
    msg = symbol;
    symbol = _chalk["default"].green('🍺');
  }

  if (lastMsg) {
    spinner.stopAndPersist({
      symbol: lastMsg.symbol,
      text: lastMsg.text
    });
  }

  spinner.text = ' ' + msg;
  lastMsg = {
    symbol: symbol + ' ',
    text: msg
  };
  spinner.start();
};

exports.start = start;

var stop = function stop(persist) {
  if (lastMsg && persist !== false) {
    spinner.stopAndPersist({
      symbol: lastMsg.symbol,
      text: lastMsg.text
    });
  } else {
    spinner.stop();
  }

  lastMsg = null;
};

exports.stop = stop;

var resume = function resume() {
  spinner.start();
};

exports.resume = resume;

var pause = function pause() {
  spinner.stop();
};

exports.pause = pause;