import path from 'path';
import fs from 'fs';
import findRoot from './findRoot';

const getEasyConfig = (cwd) => {
  const root = findRoot(cwd || process.cwd()) || process.cwd();
  const configPath = path.resolve(root, './easy.config.js');
debugger
  if (!fs.existsSync(configPath)) {
    throw new Error(`${root} 路径下没有 easy.config.js 配置文件`);
  }

  return require(configPath);
};

export default getEasyConfig;
