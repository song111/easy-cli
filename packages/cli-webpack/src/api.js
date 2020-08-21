/* eslint-disable space-before-function-paren */
import path from 'path';
import WebpackChain from 'webpack-chain';
import { fs, logger, parallelToSerial } from '@chrissong/cli-utils';

export default class API {
  /**
   * @param {String} mode 当前执行模式
   * @param {Object} options
   * {
   *   env, // 环境变量
   *   argv, // 命令行参数
   *   easyConfig, // easy.config.js中的配置对象
   *   context // 当前执行的路径，即webpack的context属性，也是当前运行的cwd
   * }
   * @param {Boolean} inspect 是否为inspect模式
   */
  constructor(mode, options, inspect) {
    this.mode = mode;
    this.options = this.formatOptions(options);
    debugger;
    this.pkg = this.resolvePackage();
    this.plugins = this.resolvePlugins();
  }

  /**
   * 环境变量
   */
  get env() {
    return this.options.env;
  }

  /**
   * 命令行参数
   */
  get argv() {
    const argv = this.options.argv;
    return {
      ...argv,
      open: argv.open || false,
      port: argv.port || 8080,
      report: argv.report || false,
      sourcemap: argv.sourcemap || false
    };
  }

  /**
   * easyConfig配置文件对象
   */
  get easyConfig() {
    return this.options.easyConfig;
  }

  /**
   * 当前程序执行路径
   */
  get context() {
    return this.options.context;
  }

  /**
   * 版本号
   */
  get version() {
    return this.pkg.version;
  }

  /**
   * resolve路径
   * @param {String} dir
   */
  resolve(dir) {
    return path.resolve(this.context, dir);
  }

  /**
   * 格式化options参数
   * @param {Object} options
   */
  formatOptions(options) {
    const { baseURL = '', chainWebpack, ...easyConfig } = options.easyConfig;
    debugger;
    return {
      ...options,
      easyConfig: {
        ...easyConfig,
        baseURL: baseURL.replace(/^\/+|\/+$/g, ''),
        chainWebpack: (config) => {
          if (typeof chainWebpack === 'function') chainWebpack(config);
          return config;
        }
      }
    };
  }

  /**
   * 获取package.json信息
   */
  resolvePackage() {
    const pkg = this.resolve('package.json');
    if (fs.existsSync(pkg)) {
      try {
        return require(pkg);
      } catch (e) {
        logger.error(`读取 ${pkg} 失败`);
        return {};
      }
    }
    return {};
  }

  /**
   * 读取package.json中的插件
   */
  resolvePlugins() {
    const plugins = ['./webpack/webpack.config', './webpack/webpack.config.dev', './webpack/webpack.config.prod'];
    return plugins.map((id) => {
      try {
        return require(id);
      } catch (err) {
        logger.error(`插件 ${id} 加载失败`);
        throw err;
      }
    });
  }

  /**
   * 获取webpack config
   */
  async resolveWebpackConfig() {
    const config = new WebpackChain();
    const { chainWebpack } = this.easyConfig;
    // 生成webpack配置
    await parallelToSerial(this.plugins.map(this.use(config)));

    return chainWebpack(config).toConfig(); // 加载配置项的webpack 配置
  }

  /**
   * 注册执行插件
   * @param {WebpackChain} config
   */
  use(config) {
    return (plugin) => {
      const api = {
        env: () => this.env,
        pkg: () => this.pkg,
        mode: () => this.mode,
        argv: () => this.argv,
        easyConfig: () => this.easyConfig,
        context: () => this.context,
        resolve: (dir) => this.resolve(dir),
        chainWebpack: (callback) => callback(config)
      };
      return () => plugin(api);
    };
  }
}
