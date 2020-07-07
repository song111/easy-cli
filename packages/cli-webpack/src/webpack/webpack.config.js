import { DefinePlugin, ProgressPlugin } from 'webpack';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';

/**
 * webpack通用配置
 * @param{Object} api api实例
 */

export default (api) => {
  api.chainWebpack((config) => {
    const env = api.env;
    const { alias, pages = {} } = api.easyConfig;

    // 设置context
    config.context(api.context).target('web');

    // output配置
    config.output.path(api.resolve('build')).publicPath('./');

    /**
     * resolve配置
     */
    config.resolve
      .when(alias, config => {
      // 路径别名
        Object.keys(alias).forEach(key => {
          config.alias.set(key, api.resolve(alias[key]))
        })
      })
      .extensions.merge(['.mjs', '.js', '.jsx', '.json', '.wasm'])
      .end()
      .mainFields.merge(['browser', 'main', 'module'])
      .end()
      .modules.merge(['node_modules', api.resolve('node_modules')])
      .end()
      .end()
      .resolveLoader.modules.merge([
        'node_modules',
        api.resolve('node_modules')
      ])

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
    config.optimization
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
    // config.module
    //   .rule('eslint')
    //   .test(/\.jsx?$/)
    //   .pre()
    //   .exclude.add(api.resolve('node_modules'))
    //   .end()
    //   .use('eslint-loader')
    //   .loader('eslint-loader')
    //   .options({
    //     emitError: false,
    //     emitWarning: true,
    //     formatter: 'eslint/lib/cli-engine/formatters/codeframe'
    //   });

    /**
     * babel配置
     */
    config.module
      .rule('babel')
      .test(/\.jsx?$/)
      .exclude.add(api.resolve('node_modules'))
      .end()
      .use('babel-loader')
      .loader('babel-loader');

    /**
     * 图片文件loader
     */
    config.module
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
    config.module
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
    config.module
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
    config.module
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
    config.plugin('define').use(DefinePlugin, [
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
    config.plugin('case-sensitive-paths').use(CaseSensitivePathsPlugin);

    /**
     * 进度条
     */
    config.plugin('progress').use(ProgressPlugin, [
      {
        activeModules: false
      }
    ]);

    debugger
    // config.plugin('html-index').use(HtmlWebpackPlugin, [{
    //   filename: 'index.html',
    //   template: api.resolve('./public/index.html'),
    //   hash: true
    // }])

    // config.entry('index')
    //   .add('./src/index.js')

    /**
     * 打包入口与html模板
     */
    Object.keys(pages).forEach((key) => {
      const { entry, template } = pages[key];

      if (Array.isArray(entry)) {
        entry.forEach((en) => config.entry(key).add(en));
      } else {
        debugger
        config.entry(key).add(entry);
      }

      debugger
      config.when(template, (config) => {
        config.plugin(`html-${key}`).use(HtmlWebpackPlugin, [
          {
            filename: `${key}.html`,
            template: api.resolve(template)
          }
        ]);
      });
    });
    /**************/
  });
};
