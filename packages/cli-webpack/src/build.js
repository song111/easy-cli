import Api from './api';
import webpack from 'webpack';
import { fs, logger } from '@chrissong/cli-utils';

export default async (options) => {
  const api = new Api('production', options);
  const config = await api.resolveWebpackConfig();
  debugger
  // 清空文件夹
  await fs.remove(config.output.path)
  return new Promise((resolve, reject) => {
    webpack(config, (err, stats) => {
      if (err) return reject(err)
      // 打印结果
      process.stdout.write(
        stats.toString({
          colors: true,
          modules: false,
          children: false,
          chunks: false,
          chunkModules: false
        }) + '\n\n'
      )
      if (stats.hasErrors()) {
        logger.error('打包失败')
        reject(new Error('Webpack build failed'))
      } else if (stats.hasWarnings()) {
        logger.warn('打包成功，但具有警告信息')
        resolve()
      } else {
        logger.done('打包成功')
        resolve()
      }
    })
  })
};
