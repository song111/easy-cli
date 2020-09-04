import os from 'os';
import path from 'path';
import gitclone from 'git-clone';
import { fs, chalk, logger, spinner } from '@chrissong/cli-utils';
import { getTemplateBranchByParams, templateRepo } from './selectTemplate';

/** 克隆模版到临时文件夹
 * @param {Object} templateParams
 *    @param {Boolean}    isBuiltTemplate
 *    @param {String}     gitAddress
 *    @param {Boolean}    isHasTs
 *    @param {Boolean}    isHasState
 *    @param {String}     pkgManager    yarn | npm
 * */

export default async (templateParams) => {
  // 创建临时目录
  const tmpdir = path.join(os.tmpdir(), 'easy');
  await fs.remove(tmpdir);

  // 内置模版
  if (templateParams.isBuiltTemplate) {
    // 获取分支
    const templateBranch = getTemplateBranchByParams(templateParams);
    spinner.start('✨', `克隆模板 ${chalk.yellow(`${templateRepo}(${templateBranch})`)}...`);

    return new Promise((resolve, reject) => {
      gitclone(templateRepo, tmpdir, { checkout: templateBranch }, (err) => {
        spinner.stop();
        if (!err) {
          logger.done(`克隆模板 ${chalk.yellow(`${templateRepo}(${templateBranch})`)} 成功`);
          return resolve(tmpdir);
        } else {
          logger.error(`克隆模板 ${chalk.yellow(`${templateRepo}(${templateBranch})`)} 失败`);
          return reject(err);
        }
      });
    });
  } else {
    // 现有项目地址
    spinner.start('⌛', `克隆项目 ${chalk.yellow(`${templateParams.gitAddress})`)}...`);
    return new Promise((resolve, reject) => {
      gitclone(templateParams.gitAddress, tmpdir, { checkout: 'master' }, (err) => {
        spinner.stop();
        if (!err) {
          logger.done(`克隆模板 ${chalk.yellow(`${templateParams.gitAddress})`)} 成功`);
          return resolve(tmpdir);
        } else {
          logger.error(`克隆模板 ${chalk.yellow(`${templateParams.gitAddress})`)} 失败`);
          return reject(err);
        }
      });
    });
  }
};
