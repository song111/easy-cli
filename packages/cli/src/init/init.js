import path from 'path';
import inquirer from 'inquirer';
import which from 'which';
import { fs, chalk, logger } from '@chrissong/cli-utils';
import { getTemplateParams } from './selectTemplate';
import cloneTemplate from './cloneTemplate';
import generateProject from './generateProject';
import install from './install';

/**
 * 项目初始化
 * @param{object} cli   cli实例对象
 * @param{object} argv  命令行参数
 */
async function init(cli, argv) {
  const targetDir = path.resolve(cli.cwd, argv.name);

  // 项目名称校验

  // 项目重复验证
  if (fs.existsSync(targetDir)) {
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
  const templateParams = await getTemplateParams();
  debugger
  const projectTmpdir = await cloneTemplate(templateParams); //  模版临时文件地址

  // 生成项目
  await generateProject(projectTmpdir, argv.name, targetDir);

  const pkgManager =
    templateParams.pkgManager === 'yarn' ? (which.sync('yarn', { nothrow: true }) ? 'yarn' : 'npm') : 'npm';

  // 安装依赖
  await install(pkgManager, targetDir);
}

export default init;
