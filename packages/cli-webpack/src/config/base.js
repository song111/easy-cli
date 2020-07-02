import { DefinePlugin, ProgressPlugin } from 'webpack';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';

/**
 * webpack通用配置
 * @param{Object} api api实例
 */

export default (api) => {
  api.chainWebpack((webpackConfig) => {
    const env = api.env;
    const { alias, pages = {} } = api.easyConfig;

    // 设置context
    webpackConfig.context(api.context).target('web');

    // output配置
    webpackConfig.output.path(api.resolve('dist')).publicPath('./');

    // resolve 配置
    webpackConfig.resolve
      .when(alias, (webpackConfig) => {
        Object.keys(alias).forEach((key) => {
          webpackConfig.alias.set(key, api.resolve(alias[key]));
        });
      })
      .extensions.merge(['.js', '.jsx', '.json', '.ts', 'tsx', 'css'])
      .end()
      .mainFields.merge(['browser', 'main', 'module'])
      .end()
      .modules.merge(['node_modules', api.resolve('node_modules')]);

    /**
     * 设置node变量
     */
    webpackConfig.node.merge({
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
    webpackConfig.optimization
      .splitChunks({
        chunks: 'all',
        name: false,
        minSize: 600 * 1024,
        maxSize: 1000 * 1024
      })
      .sideEffects(true)
      .removeEmptyChunks(true)
      .mergeDuplicateChunks(true);

    /**
     * eslint配置
     */
    webpackConfig.module
      .rule('eslint')
      .test(/\.jsx?$/)
      .pre()
      .exclude.add(api.resolve('node_modules'))
      .end()
      .use('eslint-loader')
      .loader('eslint-loader')
      .options({
        emitError: false,
        emitWarning: true,
        formatter: 'eslint/lib/cli-engine/formatters/codeframe'
      });

    /**
     * babel配置
     */
    webpackConfig.module
      .rule('babel')
      .test(/\.jsx?$/)
      .exclude.add(api.resolve('node_modules'))
      .end()
      .use('babel-loader')
      .loader('babel-loader');

    /**
     * 图片文件loader
     */
    webpackConfig.module
      .rule('images')
      .test(/\.(png|jpe?g|gif|webp)(\?.*)?$/)
      .use('url-loader')
      .loader('url-loader')
      .options({
        limit: 8192,
        name: 'static/images/[name].[hash:7].[ext]'
      });

    /**
     * svg文件loader
     * 方便单独处理svg，例如转换为react组件
     */
    webpackConfig.module
      .rule('svg')
      .test(/\.svg(\?.*)?$/)
      .use('url-loader')
      .loader('url-loader')
      .options({
        limit: 8192,
        name: 'static/images/[name].[hash:7].[ext]'
      });

    /**
     * 音视频媒体文件loader
     */
    webpackConfig.module
      .rule('media')
      .test(/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/)
      .use('url-loader')
      .loader('url-loader')
      .options({
        limit: 8192,
        name: 'static/media/[name].[hash:7].[ext]'
      });

    /**
     * 字体文件loader
     */
    webpackConfig.module
      .rule('fonts')
      .test(/\.(woff2?|eot|ttf|otf)(\?.*)?$/)
      .use('url-loader')
      .loader('url-loader')
      .options({
        limit: 8192,
        name: 'static/fonts/[name].[hash:7].[ext]'
      });

    /**
     * 环境变量
     */
    webpackConfig.plugin('define').use(DefinePlugin, [
      {
        'process.env': Object.keys(env).reduce((envs, key) => {
          envs[key] = `"${env[key]}"`;
          return envs;
        }, {})
      }
    ]);

    /**
     * 区分大小写路径
     */
    webpackConfig.plugin('case-sensitive-paths').use(CaseSensitivePathsPlugin);

    /**
     * 进度条
     */
    webpackConfig.plugin('progress').use(ProgressPlugin, [
      {
        activeModules: false
      }
    ]);

    /**
     * 打包入口与html模板
     */
    Object.keys(pages).forEach((key) => {
      const { entry, template, ...props } = pages[key];

      if (Array.isArray(entry)) {
        entry.forEach((en) => webpackConfig.entry(key).add(en));
      } else {
        webpackConfig.entry(key).add(entry);
      }
      webpackConfig.when(template, (webpackConfig) => {
        webpackConfig.plugin(`html-${key}`).use(HtmlWebpackPlugin, [
          {
            filename: `${key}.html`,
            template: api.resolve(template),
            templateParameters: (compilation, assets, options) => ({
              ...env,
              compilation: compilation,
              webpack: compilation.getStats().toJson(),
              webpackConfig: compilation.options,
              htmlWebpackPlugin: {
                files: assets,
                options: options
              }
            }),
            inject: true,
            chunksSortMode: 'auto',
            chunks: [key],
            ...props
          }
        ]);
      });
    });
  });
};
