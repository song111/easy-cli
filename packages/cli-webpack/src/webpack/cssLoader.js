import MiniCssExtractPlugin, { loader as extractLoader } from 'mini-css-extract-plugin';

/**
 * @param {*} webpackConfig webpack-chain配置对象
 * @param {*} param
 * themes @uyun/less-plugin-themes 主题数据，不传则不启用插件
 * extract 是否分离css为单独文件
 * sourceMap 是否生成sourceMap
 * filename 生成文件路径
 * chunkFilename  生成文件路径
 * publicPath 资源文件路径publicPath，以output文件夹为根路径
 */
export default (webpackConfig, { isProd, sourceMap, filename, chunkFilename, cssPublicPath }) => {
  const cssnanoOptions = {
    preset: [
      'default',
      {
        mergeLonghand: false,
        cssDeclarationSorter: false
      }
    ]
  };
  if (sourceMap) {
    cssnanoOptions.map = { inline: false };
  }

  function createCSSRule(lang, test, loader, options) {
    const baseRule = webpackConfig.module.rule(lang).test(test);

    if (isProd) {
      baseRule.use('extract-css-loader').loader(extractLoader).options({
        publicPath: cssPublicPath
      });
    } else {
      baseRule.use('style-loader').loader('style-loader');
    }

    const cssLoaderOptions = {
      modules: true, // 默认开启css module
      sourceMap,
      importLoaders: 2 + (isProd ? 1 : 0) // stylePostLoader injected by vue-loader
    };

    baseRule.use('css-loader').loader('css-loader').options(cssLoaderOptions);

    if (isProd) {
      baseRule
        .use('cssnano')
        .loader('postcss-loader')
        .options({
          sourceMap,
          plugins: [require('cssnano')(cssnanoOptions)]
        });
    }

    baseRule.use('postcss-loader').loader('postcss-loader').options({ sourceMap });

    if (loader) {
      baseRule.use(loader).loader(loader).options(Object.assign({ sourceMap }, options));
    }
  }

  createCSSRule('css', /\.css$/);
  createCSSRule('postcss', /\.p(ost)?css$/);
  createCSSRule('scss', /\.scss$/, 'sass-loader');
  createCSSRule('sass', /\.sass$/, 'sass-loader', { indentedSyntax: true });
  createCSSRule('less', /\.less$/, 'less-loader');

  /**
   * css 压缩
   * */
  if (isProd) {
    // inject CSS extraction plugin
    webpackConfig.plugin('extract-css').use(MiniCssExtractPlugin, [{ filename, chunkFilename }]);

    // minify extracted CSS
    webpackConfig.plugin('optimize-css').use(require('@intervolga/optimize-cssnano-plugin'), [
      {
        sourceMap: sourceMap,
        cssnanoOptions
      }
    ]);
  }
};
