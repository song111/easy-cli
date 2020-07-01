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

export const getTemplateQues = async () => {
  const { isHasState, isHasTs } = await inquirer.prompt([
    {
      name: 'isHasTs',
      message: '是否引入Typescript？',
      type: 'confirm'
    },
    {
      name: 'isHasState',
      message: '是否使用状态管理容器？',
      type: 'confirm'
    }
  ]);
  if (isHasState) {
    const { stateType } = await inquirer.prompt([
      {
        name: 'stateType',
        message: '请选择状态管理插件',
        type: 'list',
        choices: ['redux', 'mobx']
      }
    ]);
    return { isHasState, isHasTs, stateType };
  }

  return { isHasState, isHasTs };
};

export const getTemplateBranchByParams = (params) => {
  const { isHasTs, isHasState, stateType } = params;
  if (isHasTs) {
    return isHasState ? templateBranch[`base-${stateType}-ts`] : templateBranch[`base-ts`];
  } else {
    return isHasState ? templateBranch[`base-${stateType}`] : templateBranch[`base`];
  }
};
