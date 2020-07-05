import path from 'path';
import { fs, chalk, spinner } from '@chrissong/cli-utils';

/**
 * 根据模版生成项目文件
 * @param{string} template    模版临时路径
 * @param{string} projectName 项目名称
 * @param{string} targetDir   项目文件路径
 */
export default async (template, projectName, targetDir) => {
  spinner.start('📦', `生成项目 ${chalk.yellow(projectName)}...`);
  const pkgPath = path.resolve(template, './package.json');
  const pkgJson = await fs.readJson(pkgPath);
  pkgJson.name = projectName;
  await fs.writeJson(pkgPath, pkgJson, { spaces: 2 });
  await fs.ensureDir(targetDir); // 创建本地项目

  await Promise.all(
    fs.readdirSync(template).map((file) => {
      return fs.move(path.join(template, file), path.join(targetDir, file), {
        overwrite: true
      });
    })
  );
  spinner.stop();
};
