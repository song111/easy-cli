import path from 'path';
import chokidar from 'chokidar';
import fkill from 'fkill';
import { logger } from '@chrissong/cli-utils';

const start = (cli) => {
  return cli
    .fork(path.resolve(__dirname, './server.js'), cli.argv, {
      cwd: cli.root,
      env: cli.env,
      stdio: 'inherit'
    })
    .on('message', (msg) => msg === 'EXIT_WITH_ERROR' && cli.exit(1));
};

export default (cli, argv) => {
  logger.log('🚀  正在启动开发服务,请稍等...');

  debugger
  let startProcess = start(cli);

  //   监听配置文件的变化
  const watcher = chokidar.watch(
    [
      '.env',
      '.eslintrc',
      '.eslintrc.js',
      '.eslintignore',
      '.babelrc',
      'babel.config.js',
      '.browserslistrc',
      'easy.config.js',
      'tsconfig.json'
    ],
    {
      cwd: cli.cwd
    }
  );

  watcher.on('change', async () => {
    logger.log('🚀  检测到配置文件变化,服务正在自动重启...');
    await fkill(startProcess.pid);
    startProcess = start(cli);
  });
};
