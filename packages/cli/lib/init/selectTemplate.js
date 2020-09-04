"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTemplateBranchByParams = exports.getTemplateParams = exports.templateBranch = exports.templateRepo = void 0;

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

const getTemplateParams = async () => {
  const answers = await _inquirer.default.prompt([{
    name: 'isBuiltTemplate',
    message: '选择内置模版还是现有项目地址？',
    type: 'list',
    choices: [{
      key: 'built',
      name: '内置模版',
      value: true
    }, {
      key: 'gitproject',
      name: '现有项目',
      value: false
    }]
  }, {
    type: 'input',
    name: 'gitAddress',
    when: answers => {
      return !answers.isBuiltTemplate;
    },
    message: '请输入项目地址?',
    validate: function (value) {
      // eslint-disable-next-line no-useless-escape
      var pass = value.trim().match(/^(http(s)?:\/\/([^\/]+?\/){2}|git@[^:]+:[^\/]+?\/).*?.git$/);
      if (pass) return true;
      return '⛔请输入正确的git地址！';
    },
    filter: value => {
      return value.trim();
    }
  }, {
    name: 'isHasTs',
    message: '是否引入Typescript？',
    type: 'confirm',
    when: answers => {
      return answers.isBuiltTemplate;
    }
  }, {
    name: 'isHasState',
    message: '是否使用状态管理容器？',
    type: 'confirm',
    when: answers => {
      return answers.isBuiltTemplate;
    }
  }, {
    name: 'stateType',
    when: answers => {
      return answers.isBuiltTemplate && answers.isHasState;
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


exports.getTemplateParams = getTemplateParams;

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