"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

require("webpack");

/**
 * webpack通用配置
 * @param{Object} api api实例
 */
var _default = function _default(api) {
  api.chainWebpack(function (config) {
    var env = api.env;
    var _api$easyConfig = api.easyConfig,
        alias = _api$easyConfig.alias,
        _api$easyConfig$pages = _api$easyConfig.pages,
        pages = _api$easyConfig$pages === void 0 ? {} : _api$easyConfig$pages; // 设置context

    config.context(api.context()).target('web'); // output配置

    config.output.path(api.resolve('dist')).publicPath('./'); // resolve 配置

    config.resolve.when(alias, function (config) {
      Object.keys(alias).forEach(function (key) {
        config.alias.set(key, api.resolve(alias[key]));
      });
    }).extensions.merge(['.js', '.jsx', '.json', '.ts', 'tsx', 'css']).end().mainFields.merge(['browser', 'main', 'module']).end().modules.merge(['node_modules', api.resolve('node_modules')]);
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
  });
};

exports["default"] = _default;
//# sourceMappingURL=base.js.map