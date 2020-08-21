/* eslint-disable indent */
import isWsl from 'is-wsl';
import hash from 'hash-sum';
import { NamedChunksPlugin } from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import postcssSafeParser from 'postcss-safe-parser';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import PreloadWebpackPlugin from 'preload-webpack-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import cssLoader from './cssLoader';

export default (api) => {
  if (api.mode() !== 'production') return;

  api.chainWebpack((config) => {
    const { pages = {} } = api.easyConfig();
    const { sourcemap, report } = api.argv();

    cssLoader(config, {
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
    config
      .watch(false)
      .mode('production')
      .devtool(sourcemap ? 'source-map' : false)
      .output.filename('static/js/[name].[contenthash:8].js')
      .chunkFilename('static/js/[name].[contenthash:8].js');

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
    config.optimization.minimizer('terser').use(TerserPlugin, [
      {
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
        parallel: !isWsl,
        // Enable file caching
        cache: true,
        sourceMap: sourcemap
      }
    ]);

    /**
     * 压缩css
     */
    config.optimization.minimizer('optimize').use(OptimizeCSSAssetsPlugin, [
      {
        cssProcessorOptions: {
          parser: postcssSafeParser,
          map: sourcemap
            ? {
                // `inline: false` forces the sourcemap to be output into a
                // separate file
                inline: false,
                // `annotation: true` appends the sourceMappingURL to the end of
                // the css file, helping the browser find the sourcemap
                annotation: true
              }
            : false
        }
      }
    ]);

    /**
     * 使用chunk.name作为chunk.id，方便区别chunk文件，加强缓存
     */
    config.plugin('NamedChunksPlugin').use(NamedChunksPlugin, [
      (chunk) => {
        return chunk.name || `chunk-${hash(Array.from(chunk.modulesIterable, (m) => m.id).join('_'))}`;
      }
    ]);

    // /**
    //  * 拷贝public文件夹下的文件
    //  */
    config.plugin('copy').use(CopyWebpackPlugin, [
      [
        {
          from: api.resolve('public'),
          to: '.',
          toType: 'dir'
        }
      ]
    ]);

    // /**
    //  * prefetch配置
    //  */
    config.when(
      Object.keys(pages).find((key) => pages[key].template),
      (config) => {
        config.plugin('prefetch').use(PreloadWebpackPlugin, [
          {
            rel: 'prefetch',
            include: 'asyncChunks'
          }
        ]);
      }
    );

    /**
     * bundle-analyzer插件
     */
    config.when(report, (config) => {
      config.plugin('bundle-analyzer').use(BundleAnalyzerPlugin, [
        {
          logLevel: 'warn',
          analyzerMode: 'static',
          reportFilename: typeof report === 'string' ? report : '_report.html'
        }
      ]);
    });
  });
};
