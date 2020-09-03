"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _webpack = _interopRequireDefault(require("webpack"));

var _webpackDevServer = _interopRequireDefault(require("webpack-dev-server"));

var _cliUtils = require("@chrissong/cli-utils");

var _api = _interopRequireDefault(require("./api"));

var start = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(options) {
    var api, config;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            api = new _api["default"]('development', options);
            _context.next = 3;
            return api.resolveWebpackConfig();

          case 3:
            config = _context.sent;
            return _context.abrupt("return", new Promise(function (resolve, reject) {
              var compiler = (0, _webpack["default"])(config);
              var server = new _webpackDevServer["default"](compiler, config.devServer);
              server.listen(config.devServer.port, config.devServer.host, function (err) {
                if (err) return reject(err);
                resolve();
                if (api.argv.open) (0, _cliUtils.open)("http://localhost:".concat(config.devServer.port, "/").concat(api.easyConfig.baseURL));
              });
            }));

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function start(_x) {
    return _ref.apply(this, arguments);
  };
}();

var _default = start;
exports["default"] = _default;
module.exports = exports.default;