"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _api = _interopRequireDefault(require("./api"));

var _webpack = _interopRequireDefault(require("webpack"));

var _webpackDevServer = _interopRequireDefault(require("webpack-dev-server"));

var _cliUtils = require("@chrissong/cli-utils");

var start = function start(options) {
  var api = new _api["default"]('production', options);
  var config = api.resolveWebpackConfig();
  return new Promise(function (resolve, reject) {
    var compiler = (0, _webpack["default"])(config);
    var server = new _webpackDevServer["default"](compiler, config.devServer);
    server.listen(config.devServer.port, config.devServer.host, function (err) {
      if (err) return reject(err);
      resolve();
      if (api.argv.open) (0, _cliUtils.open)("http://localhost:".concat(config.devServer.port, "/").concat(api.easyConfig.baseURL));
    });
  });
};

var _default = start;
exports["default"] = _default;
//# sourceMappingURL=build.js.map