import path from 'path';
import inquirer from 'inquirer';
import which from 'which';
import { fs, chalk } from '@chrissong/cli-utils';
import cloneTemplate from './cloneTemplate';
import { getTemplateQues, getTemplateBranchByParams, templateRepo } from './selectTemplate';

async function init(cli, argv) {
  const projectName = path.resolve(cli.cwd, argv.name);

  // 项目重复验证
  if (fs.existsSync(projectName)) {
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

  // 创建本地文件模板
  const templateParams = await getTemplateQues();
  const templateBranch = getTemplateBranchByParams(templateParams);
  const tmpdirProject = await cloneTemplate(templateRepo, templateBranch);

  debugger;
  console.log(templateParams, templateBranch, tmpdirProject);
}

export default init;
