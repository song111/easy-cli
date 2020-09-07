import path from 'path';
import fs from 'fs';
import findRoot from './findRoot';
import { createSchema, validateAsync } from './joiSchema';
import logger from './logger';

const easyConfigSchema = createSchema((Joi) =>
  Joi.object({
    baseURL: Joi.string(),
    pages: Joi.object().pattern(
      Joi.string(),
      Joi.object()
        .keys({
          entry: Joi.when(Joi.array(), {
            then: Joi.array().min(1).items(Joi.string()),
            otherwise: Joi.string()
          }).required(),
          template: Joi.string()
        })
        .unknown()
    ),
    alias: Joi.object().pattern(Joi.string(), Joi.string()),
    proxy: Joi.when(Joi.array(), {
      then: Joi.array(),
      otherwise: Joi.object()
    }),
    chainWebpack: Joi.func()
  })
);

const getEasyConfig = async (cwd) => {
  const root = findRoot(cwd || process.cwd()) || process.cwd();
  const configPath = path.resolve(root, './easy.config.js');
  if (!fs.existsSync(configPath)) {
    throw new Error(`${root} 路径下没有 easy.config.js 配置文件`);
  }

  const easyConfig = require(configPath);
  // 校验easyConfig 的格式
  try {
    await validateAsync(easyConfigSchema, easyConfig);
  } catch (err) {
    for (const item of err.details) {
      logger.error(item.message);
    }

    // 退出程序
    // -------
  }

  return easyConfig;
};

export default getEasyConfig;
