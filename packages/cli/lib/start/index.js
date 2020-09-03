"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _command = _interopRequireDefault(require("./command"));

var _default = cli => {
  cli.register(..._command.default, argv => {
    require('./start.js')(cli, argv);
  });
};

exports.default = _default;
module.exports = exports.default;