"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _isWsl = _interopRequireDefault(require("is-wsl"));

var _hashSum = _interopRequireDefault(require("hash-sum"));

var _webpack = require("webpack");

var _terserWebpackPlugin = _interopRequireDefault(require("terser-webpack-plugin"));

var _copyWebpackPlugin = _interopRequireDefault(require("copy-webpack-plugin"));

var _postcssSafeParser = _interopRequireDefault(require("postcss-safe-parser"));

var _webpackBundleAnalyzer = require("webpack-bundle-analyzer");

var _preloadWebpackPlugin = _interopRequireDefault(require("preload-webpack-plugin"));

var _optimizeCssAssetsWebpackPlugin = _interopRequireDefault(require("optimize-css-assets-webpack-plugin"));

var _cssLoader = _interopRequireDefault(require("./cssLoader"));

/* eslint-disable indent */
var _default = function _default(api) {
  if (api.mode() !== 'production') return;
  api.chainWebpack(function (config) {
    var _api$easyConfig = api.easyConfig(),
        _api$easyConfig$pages = _api$easyConfig.pages,
        pages = _api$easyConfig$pages === void 0 ? {} : _api$easyConfig$pages;

    var _api$argv = api.argv(),
        sourcemap = _api$argv.sourcemap,
        report = _api$argv.report;

    (0, _cssLoader["default"])(config, {
      isProd: false,
      extract: true,
      sourceMap: sourcemap,
      filename: 'static/css/[name].[contenthash:8].css',
      chunkFilename: 'static/css/[id].[contenthash:8].css',
      publicPath: '../../'
    });
    /**
     * 配置模式与devtool
     * 输出文件名设置
     */

    config.watch(false).mode('production').devtool(sourcemap ? 'source-map' : false).output.filename('static/js/[name].[contenthash:8].js').chunkFilename('static/js/[name].[contenthash:8].js');
    /**
     * 不输出优化提示
     */

    config.performance.merge({
      hints: false
    });
    /**
     * 设置压缩代码
     */

    config.optimization.minimize(true);
    /**
     * 压缩js
     */

    config.optimization.minimizer('terser').use(_terserWebpackPlugin["default"], [{
      terserOptions: {
        parse: {
          // we want terser to parse ecma 8 code. However, we don't want it
          // to apply any minfication steps that turns valid ecma 5 code
          // into invalid ecma 5 code. This is why the 'compress' and 'output'
          // sections only apply transformations that are ecma 5 safe
          // https://github.com/facebook/create-react-app/pull/4234
          ecma: 8
        },
        compress: {
          ecma: 5,
          warnings: false,
          // Disabled because of an issue with Uglify breaking seemingly valid code:
          // https://github.com/facebook/create-react-app/issues/2376
          // Pending further investigation:
          // https://github.com/mishoo/UglifyJS2/issues/2011
          comparisons: false,
          // Disabled because of an issue with Terser breaking valid code:
          // https://github.com/facebook/create-react-app/issues/5250
          // Pending futher investigation:
          // https://github.com/terser-js/terser/issues/120
          inline: 2
        },
        mangle: {
          safari10: true
        },
        output: {
          ecma: 5,
          comments: false,
          // Turned on because emoji and regex is not minified properly using default
          // https://github.com/facebook/create-react-app/issues/2488
          ascii_only: true
        }
      },
      // Use multi-process parallel running to improve the build speed
      // Default number of concurrent runs: os.cpus().length - 1
      // Disabled on WSL (Windows Subsystem for Linux) due to an issue with Terser
      // https://github.com/webpack-contrib/terser-webpack-plugin/issues/21
      parallel: !_isWsl["default"],
      // Enable file caching
      cache: true,
      sourceMap: sourcemap
    }]);
    /**
     * 压缩css
     */

    config.optimization.minimizer('optimize').use(_optimizeCssAssetsWebpackPlugin["default"], [{
      cssProcessorOptions: {
        parser: _postcssSafeParser["default"],
        map: sourcemap ? {
          // `inline: false` forces the sourcemap to be output into a
          // separate file
          inline: false,
          // `annotation: true` appends the sourceMappingURL to the end of
          // the css file, helping the browser find the sourcemap
          annotation: true
        } : false
      }
    }]);
    /**
     * 使用chunk.name作为chunk.id，方便区别chunk文件，加强缓存
     */

    config.plugin('NamedChunksPlugin').use(_webpack.NamedChunksPlugin, [function (chunk) {
      return chunk.name || "chunk-".concat((0, _hashSum["default"])(Array.from(chunk.modulesIterable, function (m) {
        return m.id;
      }).join('_')));
    }]); // /**
    //  * 拷贝public文件夹下的文件
    //  */

    config.plugin('copy').use(_copyWebpackPlugin["default"], [{
      patterns: [{
        from: api.resolve('public'),
        to: '.',
        toType: 'dir'
      }]
    }]); // /**
    //  * prefetch配置
    //  */

    config.when(Object.keys(pages).find(function (key) {
      return pages[key].template;
    }), function (config) {
      config.plugin('prefetch').use(_preloadWebpackPlugin["default"], [{
        rel: 'prefetch',
        include: 'asyncChunks'
      }]);
    });
    /**
     * bundle-analyzer插件
     */

    config.when(report, function (config) {
      config.plugin('bundle-analyzer').use(_webpackBundleAnalyzer.BundleAnalyzerPlugin, [{
        logLevel: 'warn',
        analyzerMode: 'static',
        reportFilename: typeof report === 'string' ? report : '_report.html'
      }]);
    });
  });
};

exports["default"] = _default;
module.exports = exports.default;
//# sourceMappingURL=webpack.config.prod.js.map