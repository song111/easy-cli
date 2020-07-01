import os from 'os';
import path from 'path';
import gitclone from 'git-clone';
import { fs, chalk, logger, spinner } from '@chrissong/cli-utils';

/**克隆模版到临时文件夹
 * @param{string} repo      git地址
 * @param{string} branchName    分支名称
 * */

export default async (repo, branchName) => {
  spinner.start('✨', `克隆模板 ${chalk.yellow(`${repo}(${branchName})`)}...`);
  const tmpdir = path.join(os.tmpdir(), 'easy');
  await fs.remove(tmpdir);
  debugger;
  return new Promise((resolve, reject) => {
    gitclone(repo, tmpdir, { checkout: branchName }, (err) => {
      spinner.stop();
      if (!err) {
        logger.done(`克隆模板 ${`${repo}(${branchName})`} 成功`);
        return resolve(tmpdir);
      } else {
        logger.error(`克隆模板 ${`${repo}(${branchName})`} 失败`);
        return reject(err);
      }
    });
  });
};
