import inquirer from 'inquirer';
import _ from 'lodash';

export const templateRepo = 'https://github.com/song111/easy-template.git';

export const templateBranch = {
  base: 'base',
  'base-ts': 'base-ts',
  'base-redux-ts': 'base-redux-ts',
  'base-redux': 'base-redux',
  'base-mobx': 'base-mobx',
  'base-mobx-ts': 'base-mobx-ts'
};

// 获取输入参数
export const getTemplateQues = async () => {
  const answers = await inquirer.prompt([
    {
      name: 'isHasTs',
      message: '是否引入Typescript？',
      type: 'confirm'
    },
    {
      name: 'isHasState',
      message: '是否使用状态管理容器？',
      type: 'confirm'
    },
    {
      name: 'stateType',
      when: (answers) => {
        return answers.isHasState;
      },
      message: '请选择状态管理插件',
      type: 'list',
      choices: ['redux', 'mobx']
    },
    {
      name: 'pkgManager',
      message: '选择安装包管理',
      type: 'list',
      choices: ['yarn', 'npm']
    }
  ]);

  return answers;
};

/** 获取模版分支
 * @param{object} params
 *   @param{boolean}  isHasTs 是否用typescript
 *   @param{boolean}  isHasState   是否用状态管理器
 *   @param{string}   stateType     状态管理器
 * */

export const getTemplateBranchByParams = (params) => {
  const { isHasTs, isHasState, stateType } = params;
  if (isHasTs) {
    return isHasState ? templateBranch[`base-${stateType}-ts`] : templateBranch[`base-ts`];
  } else {
    return isHasState ? templateBranch[`base-${stateType}`] : templateBranch[`base`];
  }
};
