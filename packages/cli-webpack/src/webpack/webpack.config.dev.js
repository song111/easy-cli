import { HotModuleReplacementPlugin } from 'webpack';
import FriendlyErrorsPlugin from 'friendly-errors-webpack-plugin';
import { getIPv4URL, logger, chalk, formatProxy, detectPort } from '@chrissong/cli-utils';
import cssLoader from './cssLoader';

/**
 * webpack通用配置
 * @param{Object} api api实例
 */

export default async (api) => {
  if (api.mode() !== 'development') return;

  const port = await detectPort(api.argv().port);

  api.chainWebpack((config) => {
    const { baseURL, proxy } = api.easyConfig();

    const url = `http://localhost:${port}/${baseURL}`;
    const ipv4 = getIPv4URL(port, baseURL)
      .map((url) => `    ${url}`)
      .join('\n');

    // 加载样式
    cssLoader(config, {
      isProd: false,
      extract: false,
      sourceMap: true,
      filename: 'static/css/[name].css',
      chunkFilename: 'static/css/[id].css',
      publicPath: '../../'
    });

    /**
     * 配置模式与devtool
     */
    config
      .watch(true)
      .mode('development')
      .devtool('cheap-module-eval-source-map')
      .output.filename('static/js/[name].js');

    /**
     * devServer
     */
    config.devServer
      // 热更新ws地址与location.host保持一致
      .host('0.0.0.0')
      .port(port)
      .hot(true)
      .contentBase(api.resolve('public'))
      .watchContentBase(true) // 检测public下文件变动
      .publicPath('')
      .disableHostCheck(true)
      .clientLogLevel('silent')
      .compress(true)
      .overlay(true)
      .quiet(true)
      .inline(true)
      .when(proxy, (config) => {
        let oProxy = config.get('proxy');
        if (!oProxy) oProxy = [];
        oProxy = formatProxy(oProxy);
        oProxy.push(...formatProxy(proxy));
        config.proxy(oProxy);
      })
      .when(baseURL, (config) => {
        // 支持baseURL
        config.before((app, server) => {
          const regexp = new RegExp(`^/${baseURL}/?`);
          app.use((req, res, next) => {
            if (regexp.test(req.url)) {
              /**
               * /baseURL重定向到/baseURL/
               * TODO：
               * /baseURL不存在，且存在index.html的时候再跳转
               */
              if (req.path === `/${baseURL}`) {
                res.redirect(`/${baseURL}/`);
              } else {
                req.url = req.url.replace(regexp, '/');
              }
            }
            next();
          });
        });
      });

    /**
     * 热更新
     */
    config.plugin('hmr').use(HotModuleReplacementPlugin);

    /***
     * 错误提示
     */
    config.plugin('friendly-errors').use(FriendlyErrorsPlugin, [
      {
        compilationSuccessInfo: {
          messages: [`你的应用程序运行在: ${url}`],
          notes: [`你也能够使用下面地址访问: \n\n${ipv4}\n`]
        },
        onErrors: (severity, errors) => {
          // 打包失败或者具有警告也打印访问地址信息
          setImmediate(() => {
            logger.log(`\n${chalk.bgBlue.black('', 'I', '')} 你的应用程序运行在: ${url}\n`);
            logger.log(`${chalk.bgWhite.black('', 'N', '')} 你也能够使用下面地址访问:\n\n${ipv4}\n`);
          });
        }
      }
    ]);
  });
};
