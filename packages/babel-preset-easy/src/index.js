/**
 * 配置babel的presets和plugins
 * 如果opts为false则不添加config到配置中去
 * @param {*} configs presets或者plugins
 * @param {*} plugin 插件名称
 * @param {*} opts 传入配置
 * @param {*} defaultOpts 默认的配置
 */
function configBabel (configs, plugin, opts, defaultOpts) {
  if (opts === false) return configs
  plugin = [plugin, { ...defaultOpts, ...opts }]
  configs.push(plugin)
  return configs
}

export default (api, options = {}) => {
  // api.assertVersion(7)

  const {
    '@babel/preset-env': babelPresetEnvOpts,
    '@babel/preset-react': babelPresetReactOpts,
    '@babel/plugin-transform-runtime': babelPluginTransformRuntimeOpts,
    '@babel/plugin-proposal-decorators': babelPluginProposalDecoratorsOpts,
    '@babel/plugin-proposal-class-properties': babelPluginProposalClassPropertiesOpts,
    '@babel/plugin-proposal-export-default-from': babelPluginProposalExportDefaultFromOpts,
    '@babel/plugin-proposal-export-namespace-from': babelPluginProposalExportNamespaceFromOpts
  } = options

  const presets = []
  const plugins = []

  // @babel/preset-env
  configBabel(presets, '@babel/preset-env', babelPresetEnvOpts)

  // @babel/preset-react
  configBabel(presets, '@babel/preset-react', babelPresetReactOpts)

  // @babel/plugin-transform-runtime
  configBabel(plugins, '@babel/plugin-transform-runtime', babelPluginTransformRuntimeOpts, {
    corejs: false,
    helpers: true,
    regenerator: true,
    useESModules: true
  })

  /**
   * @babel/plugin-proposal-decorators
   * 与@babel/plugin-proposal-class-properties同时配置时的要求
   * https://babeljs.io/docs/en/babel-plugin-proposal-decorators#legacy
   */
  configBabel(plugins, '@babel/plugin-proposal-decorators', babelPluginProposalDecoratorsOpts, {
    legacy: true
  })

  // @babel/plugin-proposal-class-properties
  configBabel(plugins, '@babel/plugin-proposal-class-properties', babelPluginProposalClassPropertiesOpts, {
    loose: true
  })

  // @babel/plugin-proposal-export-default-from
  configBabel(plugins, '@babel/plugin-proposal-export-default-from', babelPluginProposalExportDefaultFromOpts)

  // @babel/plugin-proposal-export-namespace-from
  configBabel(plugins, '@babel/plugin-proposal-export-namespace-from', babelPluginProposalExportNamespaceFromOpts)

  return {
    presets,
    plugins
  }
}
