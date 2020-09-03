"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/**
 * 配置babel的presets和plugins
 * 如果opts为false则不添加config到配置中去
 * @param {*} configs presets或者plugins
 * @param {*} plugin 插件名称
 * @param {*} opts 传入配置
 * @param {*} defaultOpts 默认的配置
 */
function configBabel(configs, plugin, opts, defaultOpts) {
  if (opts === false) return configs;
  plugin = [plugin, _objectSpread(_objectSpread({}, defaultOpts), opts)];
  configs.push(plugin);
  return configs;
}

var _default = (api, options = {}) => {
  api.assertVersion(7);
  const {
    '@babel/preset-env': babelPresetEnvOpts,
    '@babel/preset-react': babelPresetReactOpts,
    '@babel/plugin-transform-runtime': babelPluginTransformRuntimeOpts,
    '@babel/plugin-proposal-decorators': babelPluginProposalDecoratorsOpts,
    '@babel/plugin-proposal-class-properties': babelPluginProposalClassPropertiesOpts,
    '@babel/plugin-proposal-export-default-from': babelPluginProposalExportDefaultFromOpts,
    '@babel/plugin-proposal-export-namespace-from': babelPluginProposalExportNamespaceFromOpts
  } = options;
  const presets = [];
  const plugins = []; // @babel/preset-env

  configBabel(presets, '@babel/preset-env', babelPresetEnvOpts); // @babel/preset-react

  configBabel(presets, '@babel/preset-react', babelPresetReactOpts); // @babel/plugin-transform-runtime

  configBabel(plugins, '@babel/plugin-transform-runtime', babelPluginTransformRuntimeOpts, {
    corejs: false,
    helpers: true,
    regenerator: true,
    useESModules: true
  });
  /**
   * @babel/plugin-proposal-decorators
   * 与@babel/plugin-proposal-class-properties同时配置时的要求
   * https://babeljs.io/docs/en/babel-plugin-proposal-decorators#legacy
   */

  configBabel(plugins, '@babel/plugin-proposal-decorators', babelPluginProposalDecoratorsOpts, {
    legacy: true
  }); // @babel/plugin-proposal-class-properties

  configBabel(plugins, '@babel/plugin-proposal-class-properties', babelPluginProposalClassPropertiesOpts, {
    loose: true
  }); // @babel/plugin-proposal-export-default-from

  configBabel(plugins, '@babel/plugin-proposal-export-default-from', babelPluginProposalExportDefaultFromOpts); // @babel/plugin-proposal-export-namespace-from

  configBabel(plugins, '@babel/plugin-proposal-export-namespace-from', babelPluginProposalExportNamespaceFromOpts);
  return {
    presets,
    plugins
  };
};

exports.default = _default;
module.exports = exports.default;