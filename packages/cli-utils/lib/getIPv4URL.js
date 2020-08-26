"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _os = _interopRequireDefault(require("os"));

/**
 * 获取局域网ip
 */
var _default = function _default(port, baseURL) {
  var ifaces = _os["default"].networkInterfaces();

  baseURL = baseURL.replace(/^\/+|\/+$/g, '');
  return Object.keys(ifaces).reduce(function (ips, key) {
    ifaces[key].forEach(function (iface) {
      if (iface.family === 'IPv4') {
        ips.push("http://".concat(iface.address, ":").concat(port, "/").concat(baseURL));
      }
    });
    return ips;
  }, []);
};

exports["default"] = _default;
module.exports = exports.default;