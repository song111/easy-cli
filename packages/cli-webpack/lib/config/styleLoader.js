"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _miniCssExtractPlugin = _interopRequireWildcard(require("mini-css-extract-plugin"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/**
 * @param {*} config webpack-chain配置对象
 * @param {*} param1
 * themes @uyun/less-plugin-themes 主题数据，不传则不启用插件
 * extract 是否分离css为单独文件
 * sourceMap 是否生成sourceMap
 * filename 生成文件路径
 * chunkFilename  生成文件路径
 * publicPath 资源文件路径publicPath，以output文件夹为根路径
 */
var _default = function _default(config, _ref) {
  var themes = _ref.themes,
      extract = _ref.extract,
      sourceMap = _ref.sourceMap,
      filename = _ref.filename,
      chunkFilename = _ref.chunkFilename,
      publicPath = _ref.publicPath;

  /**
   * css loader
   */
  styleLoader(config, {
    rule: 'css',
    test: /\.css$/,
    extract: extract,
    sourceMap: sourceMap,
    publicPath: publicPath
  });
  /**
   * postcss-loader
   */

  styleLoader(config, {
    rule: 'postcss',
    test: /\.p(ost)?css$/,
    extract: extract,
    sourceMap: sourceMap,
    publicPath: publicPath
  });
  /**
   * scss-loader
   */

  styleLoader(config, {
    rule: 'scss',
    test: /\.scss$/,
    extract: extract,
    sourceMap: sourceMap,
    publicPath: publicPath,
    loader: 'sass-loader'
  });
  /**
   * sass-loader
   */

  styleLoader(config, {
    rule: 'sass',
    test: /\.sass$/,
    extract: extract,
    sourceMap: sourceMap,
    publicPath: publicPath,
    loader: 'sass-loader',
    options: {
      indentedSyntax: true
    }
  });
  /**
   * stylus-loader
   */

  styleLoader(config, {
    rule: 'stylus',
    test: /\.styl(us)?$/,
    extract: extract,
    sourceMap: sourceMap,
    publicPath: publicPath,
    loader: 'stylus-loader',
    options: {
      preferPathResolver: 'webpack'
    }
  });
  /**
   * less-loader
   */

  styleLoader(config, {
    rule: 'less',
    test: /\.less$/,
    extract: extract,
    sourceMap: sourceMap,
    publicPath: publicPath,
    loader: 'less-loader',
    options: function options(_ref2) {
      var modules = _ref2.modules;
      var options = {
        javascriptEnabled: true
      };
      return options;
    }
  });
  /**
   * 分离css
   */

  config.when(extract, function (config) {
    return config.plugin('extract-css').use(_miniCssExtractPlugin["default"], [{
      filename: filename,
      chunkFilename: chunkFilename
    }]);
  });
  return config;
};
/**
 * 获取对饮的style-loader配置
 * @param {*} config webpack-chain配置对象
 * @param {*} param1
 * rule 规则名称
 * test 匹配文件正则表达式
 * extract 是否分离css到独立文件
 * sourceMap 是否生成sourceMap
 * publicPath 资源文件路径publicPath
 * loader 除了css-loader postcss-loader外的其他预处理语言loader
 * options 指定loader的参数选项，可以为对象也可以为函数
 */


exports["default"] = _default;

function styleLoader(config, _ref3) {
  var rule = _ref3.rule,
      test = _ref3.test,
      extract = _ref3.extract,
      sourceMap = _ref3.sourceMap,
      publicPath = _ref3.publicPath,
      loader = _ref3.loader,
      options = _ref3.options;
  config.module.rule(rule).test(test).oneOf('modules').when(true, function (config) {
    return oneOfLoader(config, {
      modules: true,
      extract: extract,
      sourceMap: sourceMap,
      publicPath: publicPath,
      loader: loader,
      options: options
    });
  }).end().oneOf('normal').when(true, function (config) {
    return oneOfLoader(config, {
      modules: false,
      extract: extract,
      sourceMap: sourceMap,
      publicPath: publicPath,
      loader: loader,
      options: options
    });
  });
  return config;
}

function oneOfLoader(config, _ref4) {
  var modules = _ref4.modules,
      extract = _ref4.extract,
      sourceMap = _ref4.sourceMap,
      publicPath = _ref4.publicPath,
      loader = _ref4.loader,
      options = _ref4.options;

  /**
   * style-loader
   */
  config.when(modules, function (config) {
    return config.test(/\.module\.\w+$/);
  }).when(extract, function (config) {
    config.use('extract-loader').loader(_miniCssExtractPlugin.loader).options({
      publicPath: publicPath
    });
  }, function (config) {
    config.use('style-loader').loader('style-loader');
  });
  /**
   * css-loader
   */

  config.use('css-loader').loader('css-loader').when(modules, function (config) {
    config.options({
      modules: {
        mode: 'local',
        localIdentName: '[local]--[hash:base64:7]'
      },
      sourceMap: sourceMap,
      localsConvention: 'camelCaseOnly',
      importLoaders: 1
    });
  }, function (config) {
    config.options({
      modules: false,
      sourceMap: sourceMap,
      importLoaders: 1
    });
  });
  /**
   * postcss-loader
   */

  config.use('postcss-loader').loader('postcss-loader').options({
    sourceMap: sourceMap
  });
  /**
   * 其他预处理loader
   */

  config.when(loader, function (config) {
    config.use(loader).loader(loader).when(typeof options === 'function', function (config) {
      config.options(_objectSpread(_objectSpread({}, options({
        modules: modules
      })), {}, {
        sourceMap: sourceMap
      }));
    }, function (config) {
      config.options(_objectSpread(_objectSpread({}, options), {}, {
        sourceMap: sourceMap
      }));
    });
  });
  return config;
}

module.exports = exports.default;
//# sourceMappingURL=styleLoader.js.map