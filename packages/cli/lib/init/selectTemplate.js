"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTemplateBranchByParams = exports.getTemplateQues = exports.templateBranch = exports.templateRepo = void 0;

var _inquirer = _interopRequireDefault(require("inquirer"));

/* eslint-disable dot-notation */
const templateRepo = 'https://github.com/song111/easy-template.git';
exports.templateRepo = templateRepo;
const templateBranch = {
  base: 'base',
  'base-ts': 'base-ts',
  'base-redux-ts': 'base-redux-ts',
  'base-redux': 'base-redux',
  'base-mobx': 'base-mobx',
  'base-mobx-ts': 'base-mobx-ts'
}; // 获取输入参数

exports.templateBranch = templateBranch;

const getTemplateQues = async () => {
  const answers = await _inquirer.default.prompt([{
    name: 'isHasTs',
    message: '是否引入Typescript？',
    type: 'confirm'
  }, {
    name: 'isHasState',
    message: '是否使用状态管理容器？',
    type: 'confirm'
  }, {
    name: 'stateType',
    when: answers => {
      return answers.isHasState;
    },
    message: '请选择状态管理插件',
    type: 'list',
    choices: ['redux', 'mobx']
  }, {
    name: 'pkgManager',
    message: '选择安装包管理器',
    type: 'list',
    choices: ['yarn', 'npm']
  }]);
  return answers;
};
/** 获取模版分支
 * @param{object} params
 *   @param{boolean}  isHasTs 是否用typescript
 *   @param{boolean}  isHasState   是否用状态管理器
 *   @param{string}   stateType     状态管理器
 * */


exports.getTemplateQues = getTemplateQues;

const getTemplateBranchByParams = params => {
  const {
    isHasTs,
    isHasState,
    stateType
  } = params;

  if (isHasTs) {
    return isHasState ? templateBranch[`base-${stateType}-ts`] : templateBranch['base-ts'];
  } else {
    return isHasState ? templateBranch[`base-${stateType}`] : templateBranch['base'];
  }
};

exports.getTemplateBranchByParams = getTemplateBranchByParams;