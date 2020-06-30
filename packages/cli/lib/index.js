"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

var _yargs = _interopRequireDefault(require("yargs"));

var _cliUtils = require("@chrissong/cli-utils");

var _init = _interopRequireDefault(require("./init"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var Cli = /*#__PURE__*/function () {
  function Cli(cwd) {
    var argv = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    (0, _classCallCheck2["default"])(this, Cli);
    this.cwd = cwd;
    this.argv = argv;
    this.plugins = [_init["default"]];
    this.commands = {}; // 命令集合

    this.init();
  } // 初始化


  (0, _createClass2["default"])(Cli, [{
    key: "init",
    value: function init() {
      var _this = this;

      this.root = (0, _cliUtils.findRoot)(this.cwd);
      this.env = this.getEnv();
      this.pkg = this.resolvePackages();
      this.plugins.forEach(function (plugin) {
        return _this.use(plugin);
      });
    }
    /**
     * 版本信息
     */

  }, {
    key: "getEnv",

    /**
     * 获取当前环境的环境变量
     */
    value: function getEnv() {
      debugger;
      return Object.keys(process.env).reduce(function (env, key) {
        env[key] = process.env[key];
        return env;
      }, {});
    }
    /**
     * 使用插件 注入cli 实例
     * @param {Function} plugin
     */

  }, {
    key: "use",
    value: function use(plugin) {
      plugin(this);
    }
    /**
     * 获取package.json信息
     */

  }, {
    key: "resolvePackages",
    value: function resolvePackages() {
      var pkg = _path["default"].resolve(this.root, 'package.json');

      if (!_fs["default"].existsSync(pkg)) return {};

      try {
        return require(pkg);
      } catch (err) {
        _cliUtils.logger.error("\u8BFB\u53D6".concat(pkg, "\u5931\u8D25\uFF01"));

        return {};
      }
    }
    /**
     * 注册命令
     * @param {String} cmd
     * @param {String} desc
     * @param  {...any} args
     */

  }, {
    key: "register",
    value: function register(cmd, desc) {
      var name = cmd.split(/\s+/)[0];

      if (!/^[\w:]+$/.test(name)) {
        // 只能有数字、字母、下划线、冒号组成
        throw new Error("\u547D\u4EE4\u540D\u79F0 ".concat(_cliUtils.chalk.redBright(name), " \u4E0D\u5408\u6CD5\uFF0C\u53EA\u80FD\u662F\u5B57\u6BCD\u3001\u6570\u5B57\u3001\u4E0B\u5212\u7EBF\u3001\u5192\u53F7"));
      }

      if (!desc) throw new Error('命令描述 desc 不存在');
      if (this.commands[name]) throw new Error("\u547D\u4EE4 ".concat(_cliUtils.chalk.redBright(name), " \u5DF2\u7ECF\u88AB\u5360\u7528"));

      for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }

      this.commands[name] = _objectSpread({
        cmd: cmd,
        desc: desc
      }, args);

      _yargs["default"].command.apply(_yargs["default"], [cmd, desc].concat(args));
    }
    /**
     * 解析命令行参数
     * @param {Array} argv
     */

  }, {
    key: "parse",
    value: function parse(argv) {
      this.argv = argv;

      if (this.argv.length) {
        _yargs["default"].parse(this.argv);
      } else {
        _yargs["default"].showHelp();
      }
    }
  }, {
    key: "version",
    get: function get() {
      return this.pkg.version;
    }
  }]);
  return Cli;
}();

exports["default"] = Cli;
module.exports = exports.default;
//# sourceMappingURL=index.js.map