import os from 'os';
import path from 'path';
import gitclone from 'git-clone';
import { fs, chalk, logger, spinner } from '@chrissong/cli-utils';

export default async (repo, branch) => {
  spinner.start('✨', `克隆模板 ${chalk.yellow(`${repo}(${branch})`)}...`);
  const tmpdir = path.join(os.tmpdir(), 'easy');
  await fs.remove(tmpdir);

  return new Promise((resolve, reject) => {
    debugger;
    gitclone(repo, tmpdir, { shallow: true, checkout: branch }, (err) => {
      spinner.stop();
      if (!err) return resolve(tmpdir);
      logger.error(`克隆模板 ${`${repo}(${branch})`} 失败`);
      reject(err);
    });
  });
};
