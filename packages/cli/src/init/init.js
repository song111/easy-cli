import path from 'path';
import inquirer from 'inquirer';
import which from 'which';
import { fs, chalk } from '@chrissong/cli-utils';

async function init(cli, argv) {

  const projectName = path.resolve(cli.cwd, argv.name);

  // 项目重复验证
  if (fs.existSync(projectName)) {
    const { isOverWrite } = await inquirer.prompt([
      {
        name: 'isOverWrite',
        message: `当前文件夹已存在${chalk.cyan(argv.name)},是否覆盖?`,
        type: 'confirm',
        default: true
      }
    ]);
    if (isOverWrite) {
      logger.log(`\n删除目录 ${chalk.cyan(targetDir)}...`);
      await fs.remove(targetDir);
    }
  }
}

export default init;
