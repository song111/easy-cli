"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _path = _interopRequireDefault(require("path"));

var _webpackChain = _interopRequireDefault(require("webpack-chain"));

var _cliUtils = require("@chrissong/cli-utils");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var API = /*#__PURE__*/function () {
  /**
   * @param {String} mode 当前执行模式
   * @param {Object} options
   * {
   *   env, // 环境变量
   *   argv, // 命令行参数
   *   easyConfig, // easy.config.js中的配置对象
   *   context // 当前执行的路径，即webpack的context属性，也是当前运行的cwd
   * }
   * @param {Boolean} inspect 是否为inspect模式
   */
  function API(mode, options, inspect) {
    (0, _classCallCheck2["default"])(this, API);
    this.mode = mode;
    this.options = this.formatOptions(options);
    debugger;
    this.pkg = this.resolvePackage();
    this.plugins = this.resolvePlugins();
  }
  /**
   * 环境变量
   */


  (0, _createClass2["default"])(API, [{
    key: "resolve",

    /**
     * resolve路径
     * @param {String} dir
     */
    value: function resolve(dir) {
      return _path["default"].resolve(this.context, dir);
    }
    /**
     * 格式化options参数
     * @param {Object} options
     */

  }, {
    key: "formatOptions",
    value: function formatOptions(options) {
      var _options$easyConfig = options.easyConfig,
          _options$easyConfig$b = _options$easyConfig.baseURL,
          baseURL = _options$easyConfig$b === void 0 ? '' : _options$easyConfig$b,
          _chainWebpack = _options$easyConfig.chainWebpack,
          easyConfig = (0, _objectWithoutProperties2["default"])(_options$easyConfig, ["baseURL", "chainWebpack"]);
      debugger;
      return _objectSpread(_objectSpread({}, options), {}, {
        easyConfig: _objectSpread(_objectSpread({}, easyConfig), {}, {
          baseURL: baseURL.replace(/^\/+|\/+$/g, ''),
          chainWebpack: function chainWebpack(config) {
            if (typeof _chainWebpack === 'function') _chainWebpack(config);
            return config;
          }
        })
      });
    }
    /**
     * 获取package.json信息
     */

  }, {
    key: "resolvePackage",
    value: function resolvePackage() {
      var pkg = this.resolve('package.json');

      if (_cliUtils.fs.existsSync(pkg)) {
        try {
          return require(pkg);
        } catch (e) {
          _cliUtils.logger.error("\u8BFB\u53D6 ".concat(pkg, " \u5931\u8D25"));

          return {};
        }
      }

      return {};
    }
    /**
     * 读取package.json中的插件
     */

  }, {
    key: "resolvePlugins",
    value: function resolvePlugins() {
      var plugins = ['./webpack/webpack.config', './webpack/webpack.config.dev', './webpack/webpack.config.prod'];
      return plugins.map(function (id) {
        try {
          return require(id);
        } catch (err) {
          _cliUtils.logger.error("\u63D2\u4EF6 ".concat(id, " \u52A0\u8F7D\u5931\u8D25"));

          throw err;
        }
      });
    }
    /**
     * 获取webpack config
     */

  }, {
    key: "resolveWebpackConfig",
    value: function () {
      var _resolveWebpackConfig = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
        var config, chainWebpack;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                config = new _webpackChain["default"]();
                chainWebpack = this.easyConfig.chainWebpack; // 生成webpack配置

                _context.next = 4;
                return (0, _cliUtils.parallelToSerial)(this.plugins.map(this.use(config)));

              case 4:
                return _context.abrupt("return", chainWebpack(config).toConfig());

              case 5:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function resolveWebpackConfig() {
        return _resolveWebpackConfig.apply(this, arguments);
      }

      return resolveWebpackConfig;
    }()
    /**
     * 注册执行插件
     * @param {WebpackChain} config
     */

  }, {
    key: "use",
    value: function use(config) {
      var _this = this;

      return function (plugin) {
        var api = {
          env: function env() {
            return _this.env;
          },
          pkg: function pkg() {
            return _this.pkg;
          },
          mode: function mode() {
            return _this.mode;
          },
          argv: function argv() {
            return _this.argv;
          },
          easyConfig: function easyConfig() {
            return _this.easyConfig;
          },
          context: function context() {
            return _this.context;
          },
          resolve: function resolve(dir) {
            return _this.resolve(dir);
          },
          chainWebpack: function chainWebpack(callback) {
            return callback(config);
          }
        };
        return function () {
          return plugin(api);
        };
      };
    }
  }, {
    key: "env",
    get: function get() {
      return this.options.env;
    }
    /**
     * 命令行参数
     */

  }, {
    key: "argv",
    get: function get() {
      var argv = this.options.argv;
      return _objectSpread(_objectSpread({}, argv), {}, {
        open: argv.open || false,
        port: argv.port || 8080,
        report: argv.report || false,
        sourcemap: argv.sourcemap || false
      });
    }
    /**
     * easyConfig配置文件对象
     */

  }, {
    key: "easyConfig",
    get: function get() {
      return this.options.easyConfig;
    }
    /**
     * 当前程序执行路径
     */

  }, {
    key: "context",
    get: function get() {
      return this.options.context;
    }
    /**
     * 版本号
     */

  }, {
    key: "version",
    get: function get() {
      return this.pkg.version;
    }
  }]);
  return API;
}();

exports["default"] = API;
module.exports = exports.default;
//# sourceMappingURL=api.js.map