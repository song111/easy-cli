"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _path = _interopRequireDefault(require("path"));

var _webpackChain = _interopRequireDefault(require("webpack-chain"));

var _utils = require("../utils");

var _utils2 = require("@chrissong/utils");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var API = /*#__PURE__*/function () {
  /**
   * 插件api
   * @param {String} cmd 当前执行的命令
   * @param {Object} options
   * {
   *   env, // 环境变量
   *   argv, // 命令行参数
   *   setup, // setup.config.js中的配置对象
   *   context // 当前执行的路径，即webpack的context属性，也是当前运行的cwd
   * }
   */
  function API(mode, options) {
    (0, _classCallCheck2["default"])(this, API);
    this.mode = mode;
    this.options = options;
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
     * 加载插件
     */

  }, {
    key: "resolvePlugins",
    value: function resolvePlugins() {
      var plugins = [['./webpack.config'], ['./webpack.config.dev'], ['./webpack.config.prod']];
      return plugins.concat([]).map(function (_ref) {
        var _ref2 = (0, _slicedToArray2["default"])(_ref, 2),
            id = _ref2[0],
            opts = _ref2[1];

        try {
          return {
            id: id,
            apply: require(id),
            opts: opts
          };
        } catch (err) {
          _utils.logger.error("\u63D2\u4EF6 ".concat(id, " \u52A0\u8F7D\u5931\u8D25"));

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
        var config;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                config = new _webpackChain["default"](); //  对于webpackconfig任务需要串行执行

                _context.next = 3;
                return (0, _utils2.parallelToSerial)(this.plugins.map(this.use(config)));

              case 3:
                return _context.abrupt("return", config.toConfig());

              case 4:
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

      return function (_ref3) {
        var id = _ref3.id,
            apply = _ref3.apply;
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
          setup: function setup() {
            return _this.setup;
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
          return apply(api);
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
     * setup配置文件对象
     */

  }, {
    key: "setup",
    get: function get() {
      return this.options.setup;
    }
    /**
     * 当前程序执行路径
     * 等同于process.cwd和webpack的context路径
     */

  }, {
    key: "context",
    get: function get() {
      return this.options.context;
    }
  }]);
  return API;
}();

exports["default"] = API;
module.exports = exports.default;
//# sourceMappingURL=apl.js.map