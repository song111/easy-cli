import {spinner } from '@chrissong/cli-utils'

/**
 * 安装依赖
 * @param{string} pkgManager yarn|npm
 * @param{string} targetDir  项目路径
 */
export default async (pkgManager, targetDir) => {
    spinner.start()
};
