"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _api = _interopRequireDefault(require("./api"));

var _webpack = _interopRequireDefault(require("webpack"));

var _cliUtils = require("@chrissong/cli-utils");

var _default = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(options) {
    var api, config;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            api = new _api["default"]('production', options);
            _context.next = 3;
            return api.resolveWebpackConfig();

          case 3:
            config = _context.sent;
            debugger; // 清空文件夹

            _context.next = 7;
            return _cliUtils.fs.remove(config.output.path);

          case 7:
            return _context.abrupt("return", new Promise(function (resolve, reject) {
              (0, _webpack["default"])(config, function (err, stats) {
                if (err) return reject(err); // 打印结果

                process.stdout.write(stats.toString({
                  colors: true,
                  modules: false,
                  children: false,
                  chunks: false,
                  chunkModules: false
                }) + '\n\n');

                if (stats.hasErrors()) {
                  _cliUtils.logger.error('打包失败');

                  reject(new Error('Webpack build failed'));
                } else if (stats.hasWarnings()) {
                  _cliUtils.logger.warn('打包成功，但具有警告信息');

                  resolve();
                } else {
                  _cliUtils.logger.done('打包成功');

                  resolve();
                }
              });
            }));

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();

exports["default"] = _default;
module.exports = exports.default;
//# sourceMappingURL=build.js.map