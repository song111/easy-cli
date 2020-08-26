import { start } from '@chrissong/cli-webpack';
import { logger, loadEnv, getEasyConfig } from '@chrissong/cli-utils';

// 先设置环境变量，以便在配置文件中使用
//  加载环境变量
loadEnv(process.cwd());

const env = Object.assign(process.env, {
  CMD: 'start',
  NODE_ENV: 'development',
  BABEL_ENV: 'development'
});

start({
  env: env,
  argv: process.argv.slice(2),
  context: process.cwd(),
  easyConfig: getEasyConfig(process.cwd())
}).catch((err) => {
  logger.log(err);
  process.send('EXIT_WITH_ERROR');
});
