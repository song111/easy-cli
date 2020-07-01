"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTemplateBranchByParams = exports.getTemplateQues = exports.templateBranch = exports.templateRepo = void 0;

var _inquirer = _interopRequireDefault(require("inquirer"));

var _lodash = _interopRequireDefault(require("lodash"));

const templateRepo = 'https://github.com/song111/easy-template.git';
exports.templateRepo = templateRepo;
const templateBranch = {
  base: 'base',
  'base-ts': 'base-ts',
  'base-redux-ts': 'base-redux-ts',
  'base-redux': 'base-redux',
  'base-mobx': 'base-mobx',
  'base-mobx-ts': 'base-mobx-ts'
};
exports.templateBranch = templateBranch;

const getTemplateQues = async () => {
  const {
    isHasState,
    isHasTs
  } = await _inquirer.default.prompt([{
    name: 'isHasTs',
    message: '是否引入Typescript？',
    type: 'confirm'
  }, {
    name: 'isHasState',
    message: '是否使用状态管理容器？',
    type: 'confirm'
  }]);

  if (isHasState) {
    const {
      stateType
    } = await _inquirer.default.prompt([{
      name: 'stateType',
      message: '请选择状态管理插件',
      type: 'list',
      choices: ['redux', 'mobx']
    }]);
    return {
      isHasState,
      isHasTs,
      stateType
    };
  }

  return {
    isHasState,
    isHasTs
  };
};

exports.getTemplateQues = getTemplateQues;

const getTemplateBranchByParams = params => {
  const {
    isHasTs,
    isHasState,
    stateType
  } = params;

  if (isHasTs) {
    return isHasState ? templateBranch[`base-${stateType}-ts`] : templateBranch[`base-ts`];
  } else {
    return isHasState ? templateBranch[`base-${stateType}`] : templateBranch[`base`];
  }
};

exports.getTemplateBranchByParams = getTemplateBranchByParams;
//# sourceMappingURL=selectTemplate.js.map