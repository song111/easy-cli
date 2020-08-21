"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _webpack = require("webpack");

var _caseSensitivePathsWebpackPlugin = _interopRequireDefault(require("case-sensitive-paths-webpack-plugin"));

var _htmlWebpackPlugin = _interopRequireDefault(require("html-webpack-plugin"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/**
 * webpack通用配置
 * @param{Object} api api实例
 */
var _default = function _default(api) {
  api.chainWebpack(function (config) {
    var env = api.env();

    var _api$easyConfig = api.easyConfig(),
        alias = _api$easyConfig.alias,
        _api$easyConfig$pages = _api$easyConfig.pages,
        pages = _api$easyConfig$pages === void 0 ? {} : _api$easyConfig$pages; // 设置context


    config.context(api.context()).target('web'); // output配置

    config.output.path(api.resolve('build')).publicPath('./');
    /**
     * resolve配置
     */

    config.resolve.when(alias, function (config) {
      // 路径别名
      Object.keys(alias).forEach(function (key) {
        config.alias.set(key, api.resolve(alias[key]));
      });
    }).extensions.merge(['.mjs', '.js', '.jsx', '.json', '.wasm']).end().mainFields.merge(['browser', 'main', 'module']).end().modules.merge(['node_modules', api.resolve('node_modules')]).end().end().resolveLoader.modules.merge(['node_modules', api.resolve('node_modules'), api.resolve('node_modules/@chrissong/cli-webpack/node_modules')]);
    /**
     * 设置node变量
     */

    config.node.merge({
      setImmediate: false,
      process: 'mock',
      dgram: 'empty',
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty'
    });
    /**
     * 代码切割与打包优化
     */

    config.optimization.splitChunks({
      chunks: 'all',
      name: false,
      minSize: 600 * 1024,
      maxSize: 1000 * 1024
    }).sideEffects(true).removeEmptyChunks(true).mergeDuplicateChunks(true);
    /**
     * eslint配置
     */

    config.module.rule('eslint').test(/\.jsx?$/).pre().exclude.add(api.resolve('node_modules')).end().use('eslint-loader').loader('eslint-loader').options({
      emitError: false,
      emitWarning: true,
      formatter: 'eslint/lib/cli-engine/formatters/codeframe'
    });
    /**
     * babel配置
     */

    config.module.rule('babel').test(/\.jsx?$/).exclude.add(api.resolve('node_modules')).end().use('babel-loader').loader('babel-loader');
    /**
     * 图片文件loader
     */

    config.module.rule('images').test(/\.(png|jpe?g|gif|webp)(\?.*)?$/).use('url-loader').loader('url-loader').options({
      limit: 8192,
      name: 'static/images/[name].[hash:7].[ext]'
    });
    /**
     * svg文件loader
     * 方便单独处理svg，例如转换为react组件
     */

    config.module.rule('svg').test(/\.svg(\?.*)?$/).use('url-loader').loader('url-loader').options({
      limit: 8192,
      name: 'static/images/[name].[hash:7].[ext]'
    });
    /**
     * 音视频媒体文件loader
     */

    config.module.rule('media').test(/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/).use('url-loader').loader('url-loader').options({
      limit: 8192,
      name: 'static/media/[name].[hash:7].[ext]'
    });
    /**
     * 字体文件loader
     */

    config.module.rule('fonts').test(/\.(woff2?|eot|ttf|otf)(\?.*)?$/).use('url-loader').loader('url-loader').options({
      limit: 8192,
      name: 'static/fonts/[name].[hash:7].[ext]'
    });
    /**
     * 环境变量
     */

    config.plugin('define').use(_webpack.DefinePlugin, [{
      'process.env': Object.keys(env).reduce(function (envs, key) {
        envs[key] = "\"".concat(env[key], "\"");
        return envs;
      }, {})
    }]);
    /**
     * 区分大小写路径
     */

    config.plugin('case-sensitive-paths').use(_caseSensitivePathsWebpackPlugin["default"]).end();
    /**
     * 进度条
     */

    config.plugin('progress').use(_webpack.ProgressPlugin, [{
      activeModules: false
    }]);
    /**
     * 忽略moment locale文件
     */

    config.plugin('ignore-moment').use(_webpack.IgnorePlugin, [{
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/
    }]);
    /**
     * 打包入口与html模板
     */

    Object.keys(pages).forEach(function (key) {
      var _pages$key = pages[key],
          entry = _pages$key.entry,
          template = _pages$key.template,
          props = (0, _objectWithoutProperties2["default"])(_pages$key, ["entry", "template"]);
      debugger;

      if (Array.isArray(entry)) {
        entry.forEach(function (en) {
          return config.entry(key).add(en);
        });
      } else {
        config.entry(key).add(entry);
      }

      config.when(template, function (config) {
        config.plugin("html-".concat(key)).use(_htmlWebpackPlugin["default"], [_objectSpread({
          filename: "".concat(key, ".html"),
          template: api.resolve(template),
          templateParameters: function templateParameters(compilation, assets, options) {
            return _objectSpread(_objectSpread({}, env), {}, {
              compilation: compilation,
              webpack: compilation.getStats().toJson(),
              webpackConfig: compilation.options,
              htmlWebpackPlugin: {
                files: assets,
                options: options
              }
            });
          },
          inject: true,
          chunksSortMode: 'auto',
          chunks: [key]
        }, props)]);
      });
    });
    /**************/
  });
};

exports["default"] = _default;
module.exports = exports.default;
//# sourceMappingURL=webpack.config.js.map