import { build } from '@chrissong/cli-webpack';
import { loadEnv, getEasyConfig, logger } from '@chrissong/cli-utils';

/**
 * 使用子进程是为了修正webpack执行的时候的process.cwd
 * 如果不正确则可能出现打包错误
 */
export default (cli, argv) => {
  logger.log('🚀  正在打包,请稍等...');

  loadEnv(process.cwd());
  // 先设置环境变量，以便在配置文件中使用
  const env = Object.assign(process.env, {
    CMD: 'build',
    NODE_ENV: 'production',
    BABEL_ENV: 'production'
  });

  debugger
  build({
    env: env,
    argv: argv,
    context: cli.root,
    easyConfig: getEasyConfig(cli.root)
  }).catch((err) => {
    logger.log(err);
    process.exit(1);
  });
};
