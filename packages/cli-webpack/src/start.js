import Api from './api';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import { open } from '@chrissong/cli-utils';

const start = (options) => {
  const api = new Api('development', options);
  const config = api.resolveWebpackConfig();

  return new Promise((resolve, reject) => {
    const compiler = webpack(config);
    const server = new WebpackDevServer(compiler, config.devServer);
    server.listen(config.devServer.port, config.devServer.host, (err) => {
      if (err) return reject(err);
      resolve();
      if (api.argv.open) open(`http://localhost:${config.devServer.port}/${api.easyConfig.baseURL}`);
    });
  });
};

export default start;
