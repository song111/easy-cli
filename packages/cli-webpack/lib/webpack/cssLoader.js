"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _miniCssExtractPlugin = _interopRequireWildcard(require("mini-css-extract-plugin"));

/**
 * @param {*} webpackConfig webpack-chain配置对象
 * @param {*} param
 * isProd  是否生产环境关联分离css为单独文件
 * sourceMap 是否生成sourceMap
 * filename 生成文件路径
 * chunkFilename  生成文件路径
 * publicPath 资源文件路径publicPath，以output文件夹为根路径
 */
var _default = function _default(webpackConfig, _ref) {
  var isProd = _ref.isProd,
      sourceMap = _ref.sourceMap,
      filename = _ref.filename,
      chunkFilename = _ref.chunkFilename,
      cssPublicPath = _ref.cssPublicPath;
  var cssnanoOptions = {
    preset: ['default', {
      mergeLonghand: false,
      cssDeclarationSorter: false
    }]
  };

  if (sourceMap) {
    cssnanoOptions.map = {
      inline: false
    };
  }

  function createCSSRule(lang, test, loader, options) {
    var baseRule = webpackConfig.module.rule(lang).test(test); // 匹配 *.module.* 样式文件

    var extModulesRule = baseRule.oneOf('normal-modules').test(/\.module\.\w+$/);
    applyLoaders(extModulesRule, true); // 匹配普通样式文件

    var normalRule = baseRule.oneOf('normal');
    applyLoaders(normalRule, false);

    function applyLoaders(rule, modules) {
      if (isProd) {
        rule.use('extract-css-loader').loader(_miniCssExtractPlugin.loader).options({
          publicPath: cssPublicPath
        });
      } else {
        rule.use('style-loader').loader('style-loader');
      }

      var cssLoaderOptions = {
        modules: modules,
        // 开启css module
        sourceMap: sourceMap,
        importLoaders: 2 + (isProd ? 1 : 0) // stylePostLoader injected by vue-loader

      };
      rule.use('css-loader').loader('css-loader').options(cssLoaderOptions);

      if (isProd) {
        rule.use('cssnano').loader('postcss-loader').options({
          sourceMap: sourceMap,
          plugins: [require('cssnano')(cssnanoOptions)]
        });
      }

      rule.use('postcss-loader').loader('postcss-loader').options({
        sourceMap: sourceMap
      });

      if (loader) {
        rule.use(loader).loader(loader).options(Object.assign({
          sourceMap: sourceMap
        }, options));
      }
    }
  }

  createCSSRule('css', /\.css$/);
  createCSSRule('postcss', /\.p(ost)?css$/);
  createCSSRule('scss', /\.scss$/, 'sass-loader');
  createCSSRule('sass', /\.sass$/, 'sass-loader', {
    indentedSyntax: true
  });
  createCSSRule('less', /\.less$/, 'less-loader');
  /**
   * css 压缩
   * */

  if (isProd) {
    // inject CSS extraction plugin
    webpackConfig.plugin('extract-css').use(_miniCssExtractPlugin["default"], [{
      filename: filename,
      chunkFilename: chunkFilename
    }]); // minify extracted CSS

    webpackConfig.plugin('optimize-css').use(require('@intervolga/optimize-cssnano-plugin'), [{
      sourceMap: sourceMap,
      cssnanoOptions: cssnanoOptions
    }]);
  }
};

exports["default"] = _default;
module.exports = exports.default;