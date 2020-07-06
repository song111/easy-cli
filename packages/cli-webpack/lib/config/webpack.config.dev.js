"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _styleLoader = _interopRequireDefault(require("./styleLoader"));

var _webpack = require("webpack");

var _friendlyErrorsWebpackPlugin = _interopRequireDefault(require("friendly-errors-webpack-plugin"));

var _cliUtils = require("@chrissong/cli-utils");

var _default = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(api) {
    var port;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!(api.mode !== 'development')) {
              _context.next = 2;
              break;
            }

            return _context.abrupt("return");

          case 2:
            _context.next = 4;
            return (0, _cliUtils.detectPort)(api.argv.port);

          case 4:
            port = _context.sent;
            api.chainWebpack(function (config) {
              var _api$easyConfig = api.easyConfig,
                  baseURL = _api$easyConfig.baseURL,
                  themes = _api$easyConfig.themes,
                  proxy = _api$easyConfig.proxy;
              var url = "http://localhost:".concat(port, "/").concat(baseURL);
              var ipv4 = (0, _cliUtils.getIPv4URL)(port, baseURL).map(function (url) {
                return "    ".concat(url);
              }).join('\n');
              (0, _styleLoader["default"])(config, {
                themes: themes,
                extract: false,
                sourceMap: true,
                filename: 'static/css/[name].css',
                chunkFilename: 'static/css/[id].css',
                publicPath: '../../'
              });
              /**
               * 配置模式与devtool
               */

              config.watch(true).mode('development').devtool('cheap-module-eval-source-map').output.filename('static/js/[name].js');
              /**
               * devServer
               */

              config.devServer // 热更新ws地址与location.host保持一致
              .host('0.0.0.0').port(port).hot(true).contentBase(api.resolve('public')).watchContentBase(true) // 检测public下文件变动
              .publicPath('').disableHostCheck(true).clientLogLevel('warning').compress(true).overlay(true).quiet(true).inline(true).when(proxy, function (config) {
                var _oProxy;

                var oProxy = config.get('proxy');
                if (!oProxy) oProxy = [];
                oProxy = (0, _cliUtils.formatProxy)(oProxy);

                (_oProxy = oProxy).push.apply(_oProxy, (0, _toConsumableArray2["default"])((0, _cliUtils.formatProxy)(proxy)));

                config.proxy(oProxy);
              }).when(baseURL, function (config) {
                // 支持baseURL
                config.before(function (app, server) {
                  var regexp = new RegExp("^/".concat(baseURL, "/?"));
                  app.use(function (req, res, next) {
                    if (regexp.test(req.url)) {
                      /**
                       * /baseURL重定向到/baseURL/
                       * TODO：
                       * /baseURL不存在，且存在index.html的时候再跳转
                       */
                      if (req.path === "/".concat(baseURL)) {
                        res.redirect("/".concat(baseURL, "/"));
                      } else {
                        req.url = req.url.replace(regexp, '/');
                      }
                    }

                    next();
                  });
                });
              });
              /**
               * 热更新
               */

              config.plugin('hmr').use(_webpack.HotModuleReplacementPlugin);
              /***
               * 错误提示
               */

              config.plugin('friendly-errors').use(_friendlyErrorsWebpackPlugin["default"], [{
                compilationSuccessInfo: {
                  messages: ["\u4F60\u7684\u5E94\u7528\u7A0B\u5E8F\u8FD0\u884C\u5728: ".concat(url)],
                  notes: ["\u4F60\u4E5F\u80FD\u591F\u4F7F\u7528\u4E0B\u9762\u5730\u5740\u8BBF\u95EE: \n\n".concat(ipv4, "\n")]
                },
                onErrors: function onErrors(severity, errors) {
                  // 打包失败或者具有警告也打印访问地址信息
                  setImmediate(function () {
                    _cliUtils.logger.log("\n".concat(_cliUtils.chalk.bgBlue.black('', 'I', ''), " \u4F60\u7684\u5E94\u7528\u7A0B\u5E8F\u8FD0\u884C\u5728: ").concat(url, "\n"));

                    _cliUtils.logger.log("".concat(_cliUtils.chalk.bgWhite.black('', 'N', ''), " \u4F60\u4E5F\u80FD\u591F\u4F7F\u7528\u4E0B\u9762\u5730\u5740\u8BBF\u95EE:\n\n").concat(ipv4, "\n"));
                  });
                }
              }]);
            });

          case 6:
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
//# sourceMappingURL=webpack.config.dev.js.map